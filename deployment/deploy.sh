#!/bin/bash
# =============================================================================
# Script de déploiement automatique - E-commerce Hasilaza Motor
# =============================================================================

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root (sudo)"
        exit 1
    fi
}

# Détecter si on est déjà dans le dépôt
if [ -d "$PROJECT_ROOT/.git" ]; then
    APP_DIR="$PROJECT_ROOT"
else
    APP_DIR="/opt/hasilaza-motor"
    REPO_URL="https://github.com/YattuX-Pro/e-com-sn.git"
    BRANCH="main"
fi

install_dependencies() {
    log_info "Installation des dépendances système..."
    
    apt update
    apt install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git \
        nginx \
        certbot \
        python3-certbot-nginx
    
    # Installation de Docker si non présent
    if ! command -v docker &> /dev/null; then
        log_info "Installation de Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        systemctl enable docker
        systemctl start docker
    fi
    
    # Installation de Docker Compose plugin
    if ! docker compose version &> /dev/null; then
        log_info "Installation de Docker Compose..."
        apt install -y docker-compose-plugin
    fi
    
    log_success "Dépendances installées"
}

# Cloner ou mettre à jour le repository
setup_repository() {
    log_info "Configuration du repository..."
    
    # Si on utilise déjà le dépôt local, pas besoin de cloner
    if [ "$APP_DIR" = "$PROJECT_ROOT" ]; then
        log_info "Utilisation du code local (pas de clonage nécessaire)"
        cd "$APP_DIR"
    elif [ -d "$APP_DIR" ]; then
        log_info "Mise à jour du code existant..."
        cd "$APP_DIR"
        git fetch origin
        git reset --hard origin/$BRANCH
    else
        log_info "Clonage du repository..."
        git clone -b $BRANCH $REPO_URL $APP_DIR
        cd "$APP_DIR"
    fi
    
    log_success "Repository configuré"
}

# Vérifier les fichiers de configuration
check_config() {
    log_info "Vérification des fichiers de configuration..."
    
    CONFIG_FILE="$APP_DIR/backend-api/src/EcomBackend.Api/appsettings.Production.json"
    
    if [ ! -f "$CONFIG_FILE" ]; then
        log_warning "Fichier appsettings.Production.json non trouvé !"
        log_info "Création à partir du template..."
        cp "$APP_DIR/deployment/appsettings.Production.template.json" "$CONFIG_FILE"
        log_error "IMPORTANT: Éditez $CONFIG_FILE avec vos vraies valeurs !"
        log_error "Puis relancez ce script."
        exit 1
    fi
    
    log_success "Configuration vérifiée"
}

# Créer le dossier wwwroot s'il n'existe pas
setup_wwwroot() {
    log_info "Configuration du dossier wwwroot..."
    
    WWWROOT_DIR="$APP_DIR/backend-api/src/EcomBackend.Api/wwwroot"
    
    mkdir -p "$WWWROOT_DIR/products"
    chmod -R 755 "$WWWROOT_DIR"
    
    log_success "Dossier wwwroot configuré"
}

# Build et démarrage des conteneurs Docker
# Les migrations EF Core sont exécutées automatiquement au démarrage du backend
deploy_docker() {
    log_info "Déploiement des conteneurs Docker..."
    
    cd "$APP_DIR"
    
    # Arrêter les anciens conteneurs
    docker compose -f docker-compose.prod.yml down --remove-orphans || true
    
    # Nettoyer les anciennes images
    docker image prune -f || true
    
    # Build des images
    log_info "Build des images Docker..."
    docker compose -f docker-compose.prod.yml build --no-cache
    
    # Démarrer PostgreSQL d'abord
    log_info "Démarrage de PostgreSQL..."
    docker compose -f docker-compose.prod.yml up -d ecom-postgres
    
    # Attendre que PostgreSQL soit prêt
    log_info "Attente du démarrage de PostgreSQL..."
    sleep 10
    until docker compose -f docker-compose.prod.yml exec -T ecom-postgres pg_isready -U ecom_user -d ecom_db 2>/dev/null; do
        log_info "PostgreSQL n'est pas encore prêt, attente..."
        sleep 3
    done
    log_success "PostgreSQL est prêt"
    
    # Démarrer tous les conteneurs (le backend appliquera les migrations automatiquement)
    log_info "Démarrage de tous les services..."
    docker compose -f docker-compose.prod.yml up -d
    
    # Attendre et vérifier les logs du backend pour les migrations
    log_info "Vérification des migrations (voir logs backend)..."
    sleep 15
    docker compose -f docker-compose.prod.yml logs --tail=50 ecom-backend-api | grep -E "(Migration|migration|pending|applied)" || true
    
    # Vérifier l'état des conteneurs
    docker compose -f docker-compose.prod.yml ps
    
    log_success "Conteneurs Docker déployés"
}

# Configuration de Nginx
setup_nginx() {
    log_info "Configuration de Nginx..."
    
    # Vérifier si les certificats SSL existent
    if [ -f "/etc/letsencrypt/live/yoobouko-hasilazamotor.com/fullchain.pem" ]; then
        log_info "Certificats SSL trouvés, utilisation de la configuration HTTPS..."
        cp "$APP_DIR/deployment/nginx.conf" /etc/nginx/sites-available/hasilaza-motor
    else
        log_warning "Certificats SSL non trouvés, utilisation de la configuration HTTP..."
        cp "$APP_DIR/deployment/nginx-http.conf" /etc/nginx/sites-available/hasilaza-motor
    fi
    
    # Créer le lien symbolique
    ln -sf /etc/nginx/sites-available/hasilaza-motor /etc/nginx/sites-enabled/
    
    # Supprimer le site par défaut
    rm -f /etc/nginx/sites-enabled/default
    
    # Créer le dossier pour Certbot
    mkdir -p /var/www/certbot
    
    # Tester la configuration
    nginx -t
    
    # Recharger Nginx
    systemctl reload nginx
    
    log_success "Nginx configuré"
}

# Génération des certificats SSL
setup_ssl() {
    log_info "Configuration des certificats SSL..."
    
    read -p "Voulez-vous générer les certificats SSL maintenant ? (o/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        log_info "Génération des certificats pour les domaines..."
        
        # Certificat pour le frontend
        certbot --nginx -d yoobouko-hasilazamotor.com -d www.yoobouko-hasilazamotor.com --non-interactive --agree-tos --email contact.hasilaza@gmail.com || true
        
        # Certificat pour l'API
        certbot --nginx -d api.yoobouko-hasilazamotor.com --non-interactive --agree-tos --email contact.hasilaza@gmail.com || true
        
        # Certificat pour l'admin
        certbot --nginx -d admin.yoobouko-hasilazamotor.com --non-interactive --agree-tos --email contact.hasilaza@gmail.com || true
        
        # Configurer le renouvellement automatique
        systemctl enable certbot.timer
        systemctl start certbot.timer
        
        log_success "Certificats SSL générés"
        
        # Passer à la configuration HTTPS
        log_info "Passage à la configuration HTTPS..."
        cp "$APP_DIR/deployment/nginx.conf" /etc/nginx/sites-available/hasilaza-motor
        nginx -t && systemctl reload nginx
        
        log_success "Configuration HTTPS activée"
    else
        log_warning "Certificats SSL non générés. Exécutez manuellement:"
        echo "  certbot --nginx -d yoobouko-hasilazamotor.com -d www.yoobouko-hasilazamotor.com"
        echo "  certbot --nginx -d api.yoobouko-hasilazamotor.com"
        echo "  certbot --nginx -d admin.yoobouko-hasilazamotor.com"
        echo ""
        echo "Puis relancez la configuration Nginx avec la configuration HTTPS:"
        echo "  cp $APP_DIR/deployment/nginx.conf /etc/nginx/sites-available/hasilaza-motor"
        echo "  nginx -t && systemctl reload nginx"
    fi
}

# Configuration du firewall
setup_firewall() {
    log_info "Configuration du firewall..."
    
    if command -v ufw &> /dev/null; then
        ufw allow ssh
        ufw allow 'Nginx Full'
        ufw --force enable
        log_success "Firewall configuré"
    else
        log_warning "UFW non installé, configuration du firewall ignorée"
    fi
}

# Afficher le statut final
show_status() {
    echo ""
    echo "=========================================="
    echo -e "${GREEN}Déploiement terminé !${NC}"
    echo "=========================================="
    echo ""
    echo "Services déployés:"
    docker compose -f "$APP_DIR/docker-compose.prod.yml" ps
    echo ""
    echo "URLs:"
    echo "  - Frontend: https://yoobouko-hasilazamotor.com"
    echo "  - API:      https://api.yoobouko-hasilazamotor.com"
    echo "  - Admin:    https://admin.yoobouko-hasilazamotor.com"
    echo ""
    echo "Commandes utiles:"
    echo "  - Logs:     docker compose -f $APP_DIR/docker-compose.prod.yml logs -f"
    echo "  - Restart:  docker compose -f $APP_DIR/docker-compose.prod.yml restart"
    echo "  - Stop:     docker compose -f $APP_DIR/docker-compose.prod.yml down"
    echo ""
}

# Menu principal
main() {
    echo "=========================================="
    echo "Déploiement E-commerce Hasilaza Motor"
    echo "=========================================="
    echo ""
    
    check_root
    
    PS3="Choisissez une option: "
    options=("Installation complète (première fois)" "Mise à jour du code uniquement" "Rebuild Docker uniquement" "Configurer SSL uniquement" "Quitter")
    
    select opt in "${options[@]}"
    do
        case $opt in
            "Installation complète (première fois)")
                install_dependencies
                setup_repository
                check_config
                setup_wwwroot
                deploy_docker
                setup_nginx
                setup_firewall
                setup_ssl
                show_status
                break
                ;;
            "Mise à jour du code uniquement")
                setup_repository
                check_config
                deploy_docker
                show_status
                break
                ;;
            "Rebuild Docker uniquement")
                cd "$APP_DIR"
                deploy_docker
                show_status
                break
                ;;
            "Configurer SSL uniquement")
                setup_ssl
                break
                ;;
            "Quitter")
                log_info "Au revoir !"
                exit 0
                ;;
            *)
                log_error "Option invalide"
                ;;
        esac
    done
}

# Exécution
main "$@"
