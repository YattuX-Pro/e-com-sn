# Guide de Déploiement - E-commerce Hasilaza Motor

## 📋 Vue d'ensemble

Ce guide explique comment déployer les applications e-commerce sur votre VPS.

### Architecture

```
                    ┌─────────────────────────────────────┐
                    │           VPS Ubuntu                │
                    │                                     │
   Internet ──────▶ │  ┌─────────────────────────────┐   │
                    │  │         Nginx               │   │
                    │  │    (Reverse Proxy + SSL)    │   │
                    │  └──────────┬──────────────────┘   │
                    │             │                      │
                    │   ┌─────────┼─────────┐            │
                    │   ▼         ▼         ▼            │
                    │ :3000    :5001     :3001           │
                    │ e-com   backend   admin-ecom       │
                    │   │         │         │            │
                    │   └─────────┼─────────┘            │
                    │             │ Docker Network       │
                    │             ▼                      │
                    │      host.docker.internal          │
                    │             │                      │
                    │   ┌─────────▼─────────┐            │
                    │   │    PostgreSQL     │            │
                    │   │   (sur le VPS)    │            │
                    │   └───────────────────┘            │
                    └─────────────────────────────────────┘
```

### Domaines configurés

| Service | Domaine | Port interne |
|---------|---------|--------------|
| Frontend (e-com) | yoobouko-hasilazamotor.com | 3000 |
| API Backend | api.yoobouko-hasilazamotor.com | 5001 |
| Admin Panel | admin.yoobouko-hasilazamotor.com | 3001 |

---

## 🚀 Prérequis

### Sur votre VPS

- **OS**: Ubuntu 20.04 ou 22.04 LTS
- **RAM**: Minimum 2 Go (4 Go recommandé)
- **Disque**: Minimum 20 Go
- **Accès**: SSH avec droits root/sudo

### DNS configuré

Assurez-vous que vos domaines pointent vers l'IP de votre VPS :

```
yoobouko-hasilazamotor.com      A    VOTRE_IP_VPS
www.yoobouko-hasilazamotor.com  A    VOTRE_IP_VPS
api.yoobouko-hasilazamotor.com  A    VOTRE_IP_VPS
admin.yoobouko-hasilazamotor.com A   VOTRE_IP_VPS
```

---

## 📦 Étape 1 : Installation de PostgreSQL

### 1.1 Connexion au VPS

```bash
ssh root@VOTRE_IP_VPS
```

### 1.2 Télécharger et exécuter le script PostgreSQL

```bash
# Créer un dossier temporaire
mkdir -p /tmp/deploy && cd /tmp/deploy

# Copier le script (ou créer le fichier manuellement)
nano postgres-setup.sh
# Coller le contenu du fichier deployment/postgres-setup.sh

# Rendre exécutable et lancer
chmod +x postgres-setup.sh
./postgres-setup.sh
```

### 1.3 ⚠️ IMPORTANT : Modifier les variables

Avant d'exécuter le script, modifiez ces variables dans `postgres-setup.sh` :

```bash
DB_NAME="hasilaza_db"
DB_USER="hasilaza_user"
DB_PASSWORD="VOTRE_MOT_DE_PASSE_SECURISE"  # ← CHANGEZ CECI !
```

### 1.4 Vérifier l'installation

```bash
# Tester la connexion
psql -h localhost -U hasilaza_user -d hasilaza_db

# Vérifier que PostgreSQL écoute
sudo ss -tlnp | grep 5432
```

---

## 📦 Étape 2 : Configuration de l'application

### 2.1 Créer le fichier de configuration production

Sur votre machine locale, copiez le template :

```bash
cp deployment/appsettings.Production.template.json \
   backend-api/src/EcomBackend.Api/appsettings.Production.json
```

### 2.2 Modifier les valeurs

Éditez `backend-api/src/EcomBackend.Api/appsettings.Production.json` :

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=host.docker.internal;Database=hasilaza_db;Username=hasilaza_user;Password=VOTRE_VRAI_MOT_DE_PASSE"
  },
  "Jwt": {
    "Key": "GENEREZ_UNE_CLE_ALEATOIRE_DE_64_CARACTERES_MINIMUM",
    "Issuer": "EcomBackend",
    "Audience": "EcomFrontend"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://yoobouko-hasilazamotor.com",
      "https://admin.yoobouko-hasilazamotor.com"
    ]
  }
}
```

### 2.3 Générer une clé JWT sécurisée

```bash
# Sur Linux/Mac
openssl rand -base64 64

# Ou utilisez un générateur en ligne
```

---

## 📦 Étape 3 : Déploiement

### Option A : Déploiement automatique (recommandé)

#### 3.1 Pousser le code sur GitHub

```bash
git add .
git commit -m "Préparation déploiement production"
git push origin main
```

#### 3.2 Sur le VPS, exécuter le script de déploiement

```bash
# Télécharger le script
curl -O https://raw.githubusercontent.com/VOTRE_USERNAME/e-com-sn/main/deployment/deploy.sh

# Rendre exécutable
chmod +x deploy.sh

# Exécuter
sudo ./deploy.sh
```

Le script vous proposera un menu :
1. **Installation complète** - Pour la première installation
2. **Mise à jour du code** - Pour les mises à jour suivantes
3. **Rebuild Docker uniquement** - Pour reconstruire les conteneurs
4. **Configurer SSL** - Pour générer les certificats

### Option B : Déploiement manuel

#### 3.1 Cloner le repository

```bash
cd /opt
git clone https://github.com/VOTRE_USERNAME/e-com-sn.git hasilaza-motor
cd hasilaza-motor
```

#### 3.2 Créer le fichier de configuration

```bash
nano backend-api/src/EcomBackend.Api/appsettings.Production.json
# Coller votre configuration
```

#### 3.3 Créer le dossier wwwroot

```bash
mkdir -p backend-api/src/EcomBackend.Api/wwwroot/products
chmod -R 755 backend-api/src/EcomBackend.Api/wwwroot
```

#### 3.4 Builder et démarrer les conteneurs

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

#### 3.5 Configurer Nginx

```bash
# Copier la configuration
cp deployment/nginx.conf /etc/nginx/sites-available/hasilaza-motor

# Activer le site
ln -s /etc/nginx/sites-available/hasilaza-motor /etc/nginx/sites-enabled/

# Supprimer le site par défaut
rm /etc/nginx/sites-enabled/default

# Tester et recharger
nginx -t
systemctl reload nginx
```

#### 3.6 Générer les certificats SSL

```bash
# Créer le dossier pour Certbot
mkdir -p /var/www/certbot

# Générer les certificats
certbot --nginx -d yoobouko-hasilazamotor.com -d www.yoobouko-hasilazamotor.com
certbot --nginx -d api.yoobouko-hasilazamotor.com
certbot --nginx -d admin.yoobouko-hasilazamotor.com

# Activer le renouvellement automatique
systemctl enable certbot.timer
```

---

## 🔧 Commandes utiles

### Gestion des conteneurs Docker

```bash
# Voir l'état des conteneurs
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml ps

# Voir les logs en temps réel
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml logs -f backend-api

# Redémarrer tous les services
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml restart

# Redémarrer un service spécifique
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml restart backend-api

# Arrêter tous les services
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml down

# Reconstruire et redémarrer
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml up -d --build
```

### Gestion de PostgreSQL

```bash
# Se connecter à la base de données
sudo -u postgres psql hasilaza_db

# Voir les tables
\dt

# Sauvegarder la base de données
pg_dump -U hasilaza_user hasilaza_db > backup_$(date +%Y%m%d).sql

# Restaurer une sauvegarde
psql -U hasilaza_user hasilaza_db < backup_20241229.sql
```

### Gestion de Nginx

```bash
# Tester la configuration
nginx -t

# Recharger la configuration
systemctl reload nginx

# Redémarrer Nginx
systemctl restart nginx

# Voir les logs d'erreur
tail -f /var/log/nginx/error.log

# Voir les logs d'accès
tail -f /var/log/nginx/access.log
```

### Gestion SSL

```bash
# Vérifier l'état des certificats
certbot certificates

# Renouveler manuellement
certbot renew

# Tester le renouvellement
certbot renew --dry-run
```

---

## 📁 Structure des fichiers sur le VPS

```
/opt/hasilaza-motor/
├── docker-compose.prod.yml          # Configuration Docker production
├── backend-api/
│   ├── Dockerfile
│   └── src/EcomBackend.Api/
│       ├── appsettings.Production.json  # ⚠️ Ne pas commiter !
│       └── wwwroot/
│           └── products/            # Images uploadées
├── admin-ecom/
│   └── Dockerfile
├── e-com/
│   └── Dockerfile
└── deployment/
    ├── deploy.sh
    ├── nginx.conf
    ├── postgres-setup.sh
    └── DEPLOYMENT_GUIDE.md
```

---

## 🔒 Sécurité

### Checklist de sécurité

- [ ] Mot de passe PostgreSQL fort et unique
- [ ] Clé JWT générée aléatoirement (64+ caractères)
- [ ] Certificats SSL actifs sur tous les domaines
- [ ] Firewall activé (UFW)
- [ ] Mises à jour système régulières
- [ ] Sauvegardes automatiques de la base de données

### Firewall (UFW)

```bash
# Activer le firewall
ufw enable

# Autoriser SSH, HTTP et HTTPS
ufw allow ssh
ufw allow 'Nginx Full'

# Vérifier le statut
ufw status
```

### Sauvegardes automatiques

Créez un cron job pour les sauvegardes :

```bash
crontab -e

# Ajouter cette ligne (sauvegarde quotidienne à 3h)
0 3 * * * pg_dump -U hasilaza_user hasilaza_db > /opt/backups/db_$(date +\%Y\%m\%d).sql
```

---

## 🐛 Dépannage

### L'API ne répond pas

```bash
# Vérifier les logs du backend
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml logs backend-api

# Vérifier la connexion à PostgreSQL
docker exec -it ecom-backend-api sh
# Puis dans le conteneur :
apt update && apt install -y postgresql-client
psql -h host.docker.internal -U hasilaza_user -d hasilaza_db
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que les conteneurs tournent
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml ps

# Vérifier les ports
netstat -tlnp | grep -E "3000|3001|5001"
```

### Problème de certificat SSL

```bash
# Regénérer les certificats
certbot delete --cert-name yoobouko-hasilazamotor.com
certbot --nginx -d yoobouko-hasilazamotor.com -d www.yoobouko-hasilazamotor.com
```

### Images non accessibles

```bash
# Vérifier les permissions du dossier wwwroot
ls -la /opt/hasilaza-motor/backend-api/src/EcomBackend.Api/wwwroot/

# Corriger les permissions
chmod -R 755 /opt/hasilaza-motor/backend-api/src/EcomBackend.Api/wwwroot/
```

---

## 📞 Support

En cas de problème :

1. Vérifiez les logs Docker
2. Vérifiez les logs Nginx
3. Vérifiez la connectivité à PostgreSQL
4. Consultez ce guide de dépannage

---

**Bonne chance pour votre déploiement ! 🚀**
