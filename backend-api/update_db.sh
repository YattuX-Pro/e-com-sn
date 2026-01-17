#!/bin/bash

# Script de mise à jour de la base de données PostgreSQL
# Usage: ./update_db.sh

# Configuration
CONTAINER_NAME="ecom-postgres"
DB_USER="hasilaza_user_admin"
DB_NAME="hasilaza_db"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/update_db.sql"

echo "=========================================="
echo "  Mise à jour de la base de données"
echo "=========================================="

# Vérifier si le fichier SQL existe
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Erreur: Le fichier $SQL_FILE n'existe pas"
    exit 1
fi

# Vérifier si le container Docker est en cours d'exécution
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Erreur: Le container '$CONTAINER_NAME' n'est pas en cours d'exécution"
    echo "   Lancez d'abord: docker-compose up -d"
    exit 1
fi

echo "📦 Container: $CONTAINER_NAME"
echo "👤 Utilisateur: $DB_USER"
echo "🗄️  Base de données: $DB_NAME"
echo "📄 Script SQL: $SQL_FILE"
echo ""

# Copier le fichier SQL dans le container
echo "📋 Copie du script SQL dans le container..."
docker cp "$SQL_FILE" "$CONTAINER_NAME:/tmp/update_db.sql"

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la copie du fichier"
    exit 1
fi

# Exécuter le script SQL
echo "🚀 Exécution du script SQL..."
echo ""

docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/update_db.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Mise à jour terminée avec succès!"
else
    echo ""
    echo "❌ Erreur lors de l'exécution du script SQL"
    exit 1
fi

# Nettoyer le fichier temporaire
docker exec "$CONTAINER_NAME" rm -f /tmp/update_db.sql

echo "=========================================="
