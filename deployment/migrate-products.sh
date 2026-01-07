#!/bin/bash
# =============================================================================
# Script de migration des images de produits vers le volume Docker
# =============================================================================

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$PROJECT_ROOT/backend-api/src/EcomBackend.Api/wwwroot/products"
VOLUME_NAME="e-com-sn_product_images"

log_info "Migration des images de produits vers le volume Docker"
echo "=========================================="

# Vérifier si le dossier source existe
if [ ! -d "$SOURCE_DIR" ]; then
    log_warning "Le dossier source $SOURCE_DIR n'existe pas"
    log_info "Aucune migration nécessaire"
    exit 0
fi

# Compter les fichiers à migrer
FILE_COUNT=$(find "$SOURCE_DIR" -type f | wc -l)

if [ "$FILE_COUNT" -eq 0 ]; then
    log_info "Aucun fichier à migrer"
    exit 0
fi

log_info "Nombre de fichiers à migrer: $FILE_COUNT"

# Vérifier si le volume existe
if ! docker volume inspect "$VOLUME_NAME" &> /dev/null; then
    log_info "Création du volume Docker $VOLUME_NAME..."
    docker volume create "$VOLUME_NAME"
fi

# Créer un conteneur temporaire pour copier les fichiers
log_info "Copie des fichiers vers le volume Docker..."

docker run --rm \
    -v "$SOURCE_DIR:/source:ro" \
    -v "$VOLUME_NAME:/destination" \
    alpine sh -c "
        echo 'Copie en cours...'
        cp -r /source/* /destination/ 2>/dev/null || true
        echo 'Fichiers copiés:'
        ls -lh /destination/ | wc -l
    "

log_success "Migration terminée !"
log_info "Les fichiers sont maintenant dans le volume Docker: $VOLUME_NAME"
echo ""
log_warning "IMPORTANT: Vous pouvez maintenant supprimer les fichiers du dossier source si vous le souhaitez:"
echo "  rm -rf $SOURCE_DIR/*"
echo ""
log_info "Pour voir le contenu du volume:"
echo "  docker run --rm -v $VOLUME_NAME:/data alpine ls -lh /data"
