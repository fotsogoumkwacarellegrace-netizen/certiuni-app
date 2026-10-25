# Déploiement du backend CertiUni

## Prérequis

- Node.js 24.
- Une base PostgreSQL et les variables d'environnement de production configurées dans le tableau de bord de la plateforme.
- `DATABASE_URL` pour les connexions de l'application et `DIRECT_URL` pour les migrations. Si `DIRECT_URL` n'est pas défini, Prisma utilise `DATABASE_URL`.
- `FRONTEND_URL` peut contenir plusieurs origines séparées par des virgules, par exemple `https://app.example.com,http://localhost:4200`.

Ne commitez pas `backend/.env` et ne placez aucune valeur secrète dans les fichiers de configuration suivis par Git.

## Vérification des intégrations avant déploiement

Depuis `backend/`, exécutez :

```powershell
.\scripts\predeploy.ps1
```

Le script vérifie Node.js 24, affiche les noms des variables à configurer, demande confirmation, applique `prisma migrate deploy` en utilisant `DIRECT_URL`, puis lance `npm run verify:integrations`. Il ne déploie pas l'application et ne dépend d'aucune CLI propriétaire.

Pour afficher les actions prévues sans modifier la base :

```powershell
.\scripts\predeploy.ps1 -DryRun
```

## Northflank

1. Créez un service depuis le dépôt et sélectionnez `backend/` comme répertoire de build.
2. Configurez la construction avec le `Dockerfile` du backend et le port HTTP `3000` (ou le `PORT` fourni par la plateforme).
3. Ajoutez les variables requises dans le tableau de bord Northflank ; utilisez une URL PostgreSQL directe dans `DIRECT_URL` pour les migrations et l'URL applicative dans `DATABASE_URL`.
4. Lancez `scripts/predeploy.ps1` depuis un environnement disposant des accès de base, puis déployez l'image.
5. Vérifiez `/api/v1/health` et `/api/v1/health/capabilities`.

## Render (secours)

1. Créez un Web Service lié au dépôt et définissez `backend/` comme répertoire racine.
2. Choisissez le déploiement Docker pour utiliser `backend/Dockerfile`.
3. Définissez les variables d'environnement et secrets dans le tableau de bord Render. Configurez `DATABASE_URL`, `DIRECT_URL`, `FRONTEND_URL`, `APP_URL`, `PUBLIC_VERIFY_URL`, les secrets JWT/chiffrement/QR, Stripe et SMTP.
4. Exécutez le pré-déploiement et les migrations avant de promouvoir le nouveau service.
5. Vérifiez `/api/v1/health` et `/api/v1/health/capabilities` après le démarrage.

## Entrée et commandes de production

`npm start` lance `nest start`, dont le point d'entrée est `src/main.ts` (Nest CLI, `sourceRoot: src`). Le Dockerfile démarre `node dist/src/main.js` après les migrations. `src/app.ts` est conservé pour les tests d'intégration historiques et n'est pas l'entrée de production.

Le serveur applique Helmet, les cookies, CORS et `trust proxy`. Le contrôle CORS autorise chaque origine de `FRONTEND_URL`, séparée par des virgules.

## Construire et vérifier l'image localement

Depuis `backend/` :

```powershell
docker build --progress=plain -t certiuni-backend:local .
docker run --rm --name certiuni-backend -p 3000:3000 `
  -e DATABASE_URL -e DIRECT_URL -e NODE_ENV -e FRONTEND_URL `
  certiuni-backend:local
curl.exe --fail http://localhost:3000/api/v1/health
curl.exe --fail http://localhost:3000/api/v1/health/capabilities
```

Passez les variables de votre environnement de façon à ne pas inclure de guillemets littéraux autour de leurs valeurs : `--env-file` transmet les caractères de guillemet présents dans le fichier au conteneur. Ne publiez jamais de valeur de secret dans un journal ou une sortie de diagnostic.

## Retour arrière

Redéployez l'image précédente puis vérifiez les deux sondes de santé. Prisma ne défait pas automatiquement les migrations ; restaurez une sauvegarde approuvée avant de relancer une ancienne version si une migration destructive l'exige.
