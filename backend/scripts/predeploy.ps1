[CmdletBinding()]
param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$node = Get-Command node -ErrorAction Stop
$nodeVersion = (& $node.Source --version).Trim()
if ($nodeVersion -notmatch '^v24\.') {
    throw "Node.js 24 is required; detected $nodeVersion."
}

Set-Location (Join-Path $PSScriptRoot '..')

$dashboardVariables = @(
    'NODE_ENV'
    'PORT'
    'DATABASE_URL'
    'DIRECT_URL'
    'FRONTEND_URL'
    'APP_URL'
    'PUBLIC_VERIFY_URL'
    'JWT_ACCESS_SECRET'
    'JWT_REFRESH_SECRET'
    'ENCRYPTION_KEY'
    'QR_SECRET_KEY'
    'STRIPE_SECRET_KEY'
    'STRIPE_WEBHOOK_SECRET'
    'SMTP_HOST'
    'SMTP_PORT'
    'SMTP_USER'
    'SMTP_PASS'
    'MAIL_FROM'
)

Write-Host "Node.js $nodeVersion"
Write-Host 'Variables à configurer dans le tableau de bord de la plateforme :'
$dashboardVariables | ForEach-Object { Write-Host "  $_" }

if ($DryRun) {
    Write-Host 'DryRun : aucune migration ni vérification externe ne sera lancée.'
    Write-Host 'Actions prévues : prisma migrate deploy avec DIRECT_URL, puis verify:integrations.'
    exit 0
}

if (-not $env:DIRECT_URL) {
    throw 'DIRECT_URL doit être défini pour les migrations de pré-déploiement.'
}

$confirmation = Read-Host 'Appliquer les migrations Prisma sur la base cible ? (oui/non)'
if ($confirmation -ne 'oui') {
    Write-Host 'Migration annulée.'
    exit 1
}

& npm run prisma:migrate:deploy
if ($LASTEXITCODE -ne 0) {
    throw "prisma migrate deploy a échoué (code $LASTEXITCODE)."
}

& npm run verify:integrations
if ($LASTEXITCODE -ne 0) {
    throw "verify:integrations a échoué (code $LASTEXITCODE)."
}

Write-Host 'Pré-déploiement validé. Déployez ensuite l’image via Northflank ou Render.'
