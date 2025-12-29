# Guide de Configuration - Backend E-Commerce

## Prérequis

- .NET 8 SDK
- SQL Server (LocalDB ou instance complète)
- Visual Studio 2022 / VS Code / Rider

## Installation

### 1. Restaurer les packages NuGet

```bash
cd backend-api
dotnet restore
```

### 2. Configurer la base de données

Modifiez la chaîne de connexion dans `src/EcomBackend.Api/appsettings.json` :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EcommerceDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. Créer la base de données avec Entity Framework

```bash
cd src/EcomBackend.Api
dotnet ef migrations add InitialCreate --project ../EcomBackend.Infrastructure
dotnet ef database update
```

### 4. Lancer l'application

```bash
dotnet run --project src/EcomBackend.Api
```

L'API sera disponible sur :
- HTTPS: https://localhost:7001
- HTTP: http://localhost:5001
- Swagger UI: https://localhost:7001/swagger

## Structure du Projet

```
backend-api/
├── src/
│   ├── EcomBackend.Domain/          # Entités et interfaces du domaine
│   ├── EcomBackend.Application/     # DTOs, services et logique métier
│   ├── EcomBackend.Infrastructure/  # Implémentation EF Core et services
│   └── EcomBackend.Api/             # API Minimal et endpoints
└── EcomBackend.sln
```

## Endpoints API

### Utilisateurs (`/api/users`)
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/{id}` - Détail d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

### Produits (`/api/products`)
- `GET /api/products` - Liste tous les produits
- `GET /api/products/{id}` - Détail d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

### Commandes (`/api/orders`)
- `GET /api/orders` - Liste toutes les commandes
- `GET /api/orders/{id}` - Détail d'une commande
- `POST /api/orders` - Créer une commande
- `PATCH /api/orders/{id}/status` - Mettre à jour le statut
- `DELETE /api/orders/{id}` - Supprimer une commande

## CORS

Le CORS est configuré pour accepter toutes les origines en développement. 
Pour la production, modifiez la politique CORS dans `Program.cs`.

## Tests

Pour tester l'API :
1. Ouvrez Swagger UI à https://localhost:7001/swagger
2. Testez les endpoints directement (pas d'authentification requise)
3. Créez des produits, utilisateurs et commandes via l'interface Swagger

## Statuts de commande

Les statuts possibles pour les commandes :
- `pending` - En attente
- `confirmed` - Confirmée
- `shipped` - Expédiée
- `delivered` - Livrée
- `cancelled` - Annulée
