-- Se connecter à PostgreSQL
-- docker exec -it ecom-postgres psql -U hasilaza_user_admin -d hasilaza_db

-- Ajouter les colonnes manquantes à la table Products
ALTER TABLE "Products" 
ADD COLUMN IF NOT EXISTS "CapaciteCharge" character varying(100),
ADD COLUMN IF NOT EXISTS "TypeCarburant" character varying(100),
ADD COLUMN IF NOT EXISTS "Etat" character varying(100);

-- Mettre des valeurs par défaut pour les enregistrements existants
UPDATE "Products" 
SET 
    "CapaciteCharge" = COALESCE("CapaciteCharge", ''),
    "TypeCarburant" = COALESCE("TypeCarburant", ''),
    "Etat" = COALESCE("Etat", '')
WHERE "CapaciteCharge" IS NULL 
   OR "TypeCarburant" IS NULL 
   OR "Etat" IS NULL;

-- Créer les tables manquantes pour SpareParts et SparePartOrders
CREATE TABLE IF NOT EXISTS "SpareParts" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Description" text NOT NULL DEFAULT '',
    "Price" numeric(18,2) NOT NULL,
    "Stock" integer NOT NULL,
    "Image" character varying(500) NOT NULL DEFAULT '',
    "Category" character varying(200) NOT NULL DEFAULT '',
    "Reference" character varying(200) NOT NULL DEFAULT '',
    "Compatibilite" text NOT NULL DEFAULT '',
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_SpareParts" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "SparePartCategories" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Description" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_SparePartCategories" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "SparePartOrders" (
    "Id" uuid NOT NULL,
    "OrderId" character varying(50) NOT NULL,
    "CustomerName" character varying(200) NOT NULL,
    "CustomerPhone" character varying(50) NOT NULL,
    "CustomerEmail" character varying(255) NOT NULL DEFAULT '',
    "CustomerAddress" character varying(500) NOT NULL DEFAULT '',
    "SparePartId" uuid NOT NULL,
    "SparePartName" character varying(200) NOT NULL,
    "SparePartReference" character varying(200) NOT NULL DEFAULT '',
    "Quantity" integer NOT NULL,
    "TotalPrice" numeric(18,2) NOT NULL,
    "Status" character varying(50) NOT NULL DEFAULT 'pending',
    "Comment" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_SparePartOrders" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "RepairRequests" (
    "Id" uuid NOT NULL,
    "CustomerName" character varying(200) NOT NULL,
    "CustomerPhone" character varying(50) NOT NULL,
    "CustomerEmail" character varying(255),
    "VehicleModel" character varying(200) NOT NULL,
    "ProblemDescription" text NOT NULL,
    "Status" character varying(50) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RepairRequests" PRIMARY KEY ("Id")
);

-- Ajouter les colonnes manquantes à SpareParts si elles n'existent pas
ALTER TABLE "SpareParts" 
ADD COLUMN IF NOT EXISTS "Category" character varying(200) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "Reference" character varying(200) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "Compatibilite" text NOT NULL DEFAULT '';

-- Ajouter les colonnes manquantes à SparePartOrders si elles n'existent pas
ALTER TABLE "SparePartOrders"
ADD COLUMN IF NOT EXISTS "CustomerAddress" character varying(500) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "SparePartReference" character varying(200) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "Comment" text,
ADD COLUMN IF NOT EXISTS "InternalNotes" text;

-- Ajouter la colonne Comment à la table Orders (commandes produits)
ALTER TABLE "Orders" 
ADD COLUMN IF NOT EXISTS "Comment" text,
ADD COLUMN IF NOT EXISTS "InternalNotes" text;

