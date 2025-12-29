# E-Commerce Backend API - Hasilaza

Backend API pour l'application e-commerce Hasilaza (tricycles), développé avec .NET 8 Minimal API et Clean Architecture.

## Architecture

Le projet suit les principes de Clean Architecture avec les couches suivantes :

- **EcomBackend.Domain** : Entités du domaine (Product, Order, User)
- **EcomBackend.Application** : DTOs et interfaces de services
- **EcomBackend.Infrastructure** : Implémentation EF Core et services
- **EcomBackend.Api** : Endpoints API organisés par ressource

## Entités

### Product
- Nom, prix, description courte/longue
- Catégorie (string), image principale, galerie d'images
- Stock, bestseller flag

### Order
- Informations client (nom, téléphone, email, adresse)
- Produit commandé (ID + nom)
- Quantité, prix total, statut

### User
- Nom, email, téléphone
- Rôle (admin/manager/viewer)
- Statut (active/inactive)

## Technologies

- .NET 8 Minimal API
- Entity Framework Core 8
- SQL Server
- Swagger/OpenAPI

## Démarrage

```bash
cd backend-api
dotnet restore
dotnet run --project src/EcomBackend.Api
```

L'API sera disponible sur :
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`
- Swagger: `https://localhost:7001/swagger`
