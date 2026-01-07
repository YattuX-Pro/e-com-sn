# Gestion des fichiers uploadés avec Docker Volumes

## Problème résolu

Les fichiers uploadés (images de produits) dans `wwwroot/products` ne doivent **PAS** être inclus dans l'image Docker car :
1. Ils causent des conflits lors du build (fichiers .jpg vs .JPG sur Linux)
2. Ils sont perdus lors des mises à jour du conteneur
3. Ils alourdissent inutilement l'image Docker

## Solution mise en place

### 1. Volume Docker persistant

Les images de produits sont maintenant stockées dans un **volume Docker nommé** `product_images` qui :
- Persiste les données même après suppression du conteneur
- N'est pas affecté par les mises à jour du code
- Est partagé entre les redémarrages

### 2. Configuration

**`.dockerignore`** (backend-api)
```
**/wwwroot/products/**
```
→ Exclut le dossier products du build Docker

**`docker-compose.prod.yml`**
```yaml
volumes:
  - product_images:/app/wwwroot/products
```
→ Monte le volume persistant dans le conteneur

### 3. Migration des fichiers existants

Le script `migrate-products.sh` copie automatiquement les fichiers existants vers le volume Docker lors du déploiement.

## Utilisation

### Déploiement normal
```bash
./deploy.sh
# Choisir option 1, 2 ou 3
# La migration se fait automatiquement
```

### Migration manuelle (si nécessaire)
```bash
cd deployment
chmod +x migrate-products.sh
./migrate-products.sh
```

### Voir le contenu du volume
```bash
docker run --rm -v e-com-sn_product_images:/data alpine ls -lh /data
```

### Sauvegarder le volume
```bash
docker run --rm -v e-com-sn_product_images:/data -v $(pwd):/backup alpine tar czf /backup/product-images-backup.tar.gz -C /data .
```

### Restaurer le volume
```bash
docker run --rm -v e-com-sn_product_images:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/product-images-backup.tar.gz"
```

### Nettoyer les anciens fichiers locaux (optionnel)
```bash
# Après avoir vérifié que la migration a réussi
rm -rf backend-api/src/EcomBackend.Api/wwwroot/products/*
```

## Avantages

✅ **Persistance** : Les fichiers survivent aux mises à jour  
✅ **Performance** : Build Docker plus rapide  
✅ **Pas de conflits** : Fini les erreurs .jpg vs .JPG  
✅ **Séparation** : Code et données séparés (bonne pratique)  
✅ **Sauvegarde facile** : Un seul volume à sauvegarder  

## Structure finale

```
Serveur de production
├── Code (dans l'image Docker)
│   └── Mis à jour à chaque déploiement
└── Données (dans le volume Docker)
    └── product_images/
        ├── a0ce988d-67da-42e6-b1f9-9cea82bfb053-01.jpg
        ├── a0ce988d-67da-42e6-b1f9-9cea82bfb053-02.jpg
        └── ...
```

## Volumes Docker créés

- `e-com-sn_postgres_data` : Base de données PostgreSQL
- `e-com-sn_product_images` : Images de produits uploadées
