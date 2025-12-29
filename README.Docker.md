# Guide Docker pour e-com-sn

## Prérequis
- Docker et Docker Compose installés
- PostgreSQL en cours d'exécution sur votre machine locale (port 5432)
- Base de données `hasilaza_db` créée

## Structure des services

### Services dockerisés :
1. **backend-api** - API .NET 8 (port 5001)
2. **admin-ecom** - Interface admin Next.js (port 3001)
3. **e-com** - Interface client Next.js (port 3000)

### Base de données :
- PostgreSQL reste sur votre machine locale (non dockerisée)
- Accessible via `host.docker.internal` depuis les conteneurs

## Commandes Docker

### Démarrer tous les services
```bash
docker-compose up -d
```

### Démarrer avec rebuild
```bash
docker-compose up -d --build
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend-api
docker-compose logs -f admin-ecom
docker-compose logs -f e-com
```

### Arrêter les services
```bash
docker-compose down
```

### Arrêter et supprimer les volumes
```bash
docker-compose down -v
```

## Accès aux applications

- **Frontend client** : http://localhost:3000
- **Admin panel** : http://localhost:3001
- **Backend API** : http://localhost:5001
- **Swagger** : http://localhost:5001/swagger

## Configuration de la base de données

La connexion à PostgreSQL utilise `host.docker.internal` pour accéder à votre base de données locale depuis les conteneurs Docker.

**Important** : Assurez-vous que PostgreSQL accepte les connexions depuis Docker :
1. Vérifiez que PostgreSQL écoute sur toutes les interfaces ou sur 0.0.0.0
2. Configurez `pg_hba.conf` pour autoriser les connexions depuis les conteneurs Docker

## Dépannage

### Le backend ne peut pas se connecter à PostgreSQL
- Vérifiez que PostgreSQL est en cours d'exécution : `pg_isready`
- Vérifiez les logs : `docker-compose logs backend-api`
- Sur Windows, `host.docker.internal` devrait fonctionner automatiquement
- Sur Linux, ajoutez `--add-host=host.docker.internal:host-gateway` si nécessaire

### Rebuild d'un service spécifique
```bash
docker-compose up -d --build backend-api
```

### Nettoyer les images Docker
```bash
docker system prune -a
```
