# Script de mise a jour de la base de donnees PostgreSQL
# Usage: .\update_db.ps1

# Configuration
$CONTAINER_NAME = "ecom-postgres"
$DB_USER = "hasilaza_user_admin"
$DB_NAME = "hasilaza_db"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$SQL_FILE = Join-Path $SCRIPT_DIR "update_db.sql"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Mise a jour de la base de donnees" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Verifier si le fichier SQL existe
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "[ERREUR] Le fichier $SQL_FILE n'existe pas" -ForegroundColor Red
    exit 1
}

# Verifier si le container Docker est en cours d'execution
$containerRunning = docker ps --format "{{.Names}}" | Select-String -Pattern "^$CONTAINER_NAME$"
if (-not $containerRunning) {
    Write-Host "[ERREUR] Le container '$CONTAINER_NAME' n'est pas en cours d'execution" -ForegroundColor Red
    Write-Host "   Lancez d'abord: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Container: $CONTAINER_NAME" -ForegroundColor Green
Write-Host "[OK] Utilisateur: $DB_USER" -ForegroundColor Green
Write-Host "[OK] Base de donnees: $DB_NAME" -ForegroundColor Green
Write-Host "[OK] Script SQL: $SQL_FILE" -ForegroundColor Green
Write-Host ""

# Copier le fichier SQL dans le container
Write-Host "[INFO] Copie du script SQL dans le container..." -ForegroundColor Yellow
docker cp $SQL_FILE "${CONTAINER_NAME}:/tmp/update_db.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERREUR] Erreur lors de la copie du fichier" -ForegroundColor Red
    exit 1
}

# Executer le script SQL
Write-Host "[INFO] Execution du script SQL..." -ForegroundColor Yellow
Write-Host ""

docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -f /tmp/update_db.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCES] Mise a jour terminee avec succes!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ERREUR] Erreur lors de l'execution du script SQL" -ForegroundColor Red
    exit 1
}

# Nettoyer le fichier temporaire
docker exec $CONTAINER_NAME rm -f /tmp/update_db.sql

Write-Host "==========================================" -ForegroundColor Cyan
