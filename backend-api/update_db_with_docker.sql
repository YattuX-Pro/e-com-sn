# Se connecter à PostgreSQL
docker exec -it ecom-postgres psql -U hasilaza_user_admin -d hasilaza_db

# Copier-coller le script SQL ci-dessus

# Ou exécuter directement depuis un fichier
docker exec -i ecom-postgres psql -U hasilaza_user_admin -d hasilaza_db << 'EOF'
ALTER TABLE "Products" 
ADD COLUMN IF NOT EXISTS "CapaciteCharge" character varying(100),
ADD COLUMN IF NOT EXISTS "TypeCarburant" character varying(100),
ADD COLUMN IF NOT EXISTS "Etat" character varying(100);

UPDATE "Products" 
SET 
    "CapaciteCharge" = COALESCE("CapaciteCharge", ''),
    "TypeCarburant" = COALESCE("TypeCarburant", ''),
    "Etat" = COALESCE("Etat", '');

CREATE TABLE IF NOT EXISTS "SpareParts" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Description" text,
    "Price" numeric(18,2) NOT NULL,
    "Stock" integer NOT NULL,
    "Image" character varying(500),
    "CategoryId" uuid,
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
    "CustomerEmail" character varying(255),
    "SparePartId" uuid NOT NULL,
    "SparePartName" character varying(200) NOT NULL,
    "Quantity" integer NOT NULL,
    "TotalPrice" numeric(18,2) NOT NULL,
    "Status" character varying(50) NOT NULL,
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
EOF

# Redémarrer le backend
docker compose -f /app/docker-compose.prod.yml restart backend-api