# Voir les logs en temps réel
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml logs -f

# Redémarrer un service spécifique
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml restart backend-api

# Vérifier l'état des conteneurs
docker compose -f /opt/hasilaza-motor/docker-compose.prod.yml ps