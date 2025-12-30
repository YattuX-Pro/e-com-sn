#!/bin/bash
# =============================================================================
# Script d'installation et configuration de PostgreSQL pour le VPS
# =============================================================================

set -e

echo "=========================================="
echo "Installation de PostgreSQL sur le VPS"
echo "=========================================="

# Variables - À MODIFIER AVANT EXÉCUTION
DB_NAME="hasilaza_db"
DB_USER="hasilaza_user_admin"
DB_PASSWORD="H@siLaz@.2025"  # CHANGEZ CE MOT DE PASSE !

# Mise à jour du système
echo "[1/6] Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation de PostgreSQL
echo "[2/6] Installation de PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Démarrage et activation du service
echo "[3/6] Démarrage du service PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Création de l'utilisateur et de la base de données
echo "[4/6] Création de l'utilisateur et de la base de données..."
sudo -u postgres psql <<EOF
-- Créer l'utilisateur
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';

-- Créer la base de données
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};

-- Accorder tous les privilèges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Se connecter à la base et accorder les privilèges sur le schema public
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF

# Configuration pour permettre les connexions Docker
echo "[5/6] Configuration des connexions Docker..."

# Obtenir la version de PostgreSQL
PG_VERSION=$(ls /etc/postgresql/)
PG_HBA="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"
PG_CONF="/etc/postgresql/${PG_VERSION}/main/postgresql.conf"

# Backup des fichiers de configuration
sudo cp ${PG_HBA} ${PG_HBA}.backup
sudo cp ${PG_CONF} ${PG_CONF}.backup

# Permettre les connexions depuis Docker (172.17.0.0/16 est le réseau Docker par défaut)
echo "# Connexions Docker" | sudo tee -a ${PG_HBA}
echo "host    ${DB_NAME}    ${DB_USER}    172.17.0.0/16    md5" | sudo tee -a ${PG_HBA}
echo "host    ${DB_NAME}    ${DB_USER}    172.18.0.0/16    md5" | sudo tee -a ${PG_HBA}
echo "host    ${DB_NAME}    ${DB_USER}    172.19.0.0/16    md5" | sudo tee -a ${PG_HBA}

# Écouter sur toutes les interfaces (nécessaire pour Docker)
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" ${PG_CONF}

# Redémarrage de PostgreSQL
echo "[6/6] Redémarrage de PostgreSQL..."
sudo systemctl restart postgresql

echo "=========================================="
echo "Installation terminée !"
echo "=========================================="
echo ""
echo "Base de données: ${DB_NAME}"
echo "Utilisateur: ${DB_USER}"
echo "Mot de passe: ${DB_PASSWORD}"
echo ""
echo "IMPORTANT: Notez bien ces informations et mettez à jour"
echo "le fichier appsettings.Production.json avec ces valeurs."
echo ""
echo "Pour tester la connexion:"
echo "  psql -h localhost -U ${DB_USER} -d ${DB_NAME}"
echo ""
