# Déploiement du backend CertiUni

## Prérequis

- Node.js 24 LTS pour les commandes locales.
- PostgreSQL accessible via `DATABASE_URL` (connexion directe recommandée, car le conteneur exécute `prisma migrate deploy` avant le démarrage).
- Configuration des intégrations requises dans le gestionnaire de secrets de la plateforme : JWT, chiffrement, signature QR, Stripe et SMTP.
- Copier les seuls noms de variables depuis [`.env.example`](./.env.example), puis fournir les vraies valeurs hors du dépôt. Ne pas committer `backend/.env`.

En production, l'application refuse de démarrer si une variable MVP requise manque ou est invalide. `GET /api/v1/health` vérifie PostgreSQL et la mémoire ; `GET /api/v1/health/capabilities` indique les intégrations activées sans retourner de valeur sensible.

## Vérifier les intégrations

Après avoir injecté la configuration dans l'environnement cible, exécuter
`npm run verify:integrations` depuis `backend/`. Le script affiche uniquement
des statuts et des noms de variables invalides ou absentes, jamais leurs
valeurs. Il vérifie PostgreSQL (y compris une transaction en lecture seule),
JWT, QR, Stripe en mode test, SMTP et S3 si ce dernier est configuré.
Pour Stripe, il crée puis expire une session Checkout de test ; il ne débite
aucun paiement.

## Construire et lancer avec Docker

Depuis la racine du dépôt :

```sh
docker build -t certiuni-backend:local ./backend
docker run --rm --name certiuni-backend \
  --env-file backend/.env \
  -p 3000:3000 \
  certiuni-backend:local
```

L'image utilise Node 24, exécute `prisma generate`, applique `prisma migrate deploy`, puis lance `dist/src/main.js` avec l'utilisateur non-root `node`.

Vérifier le conteneur :

```sh
curl --fail http://localhost:3000/api/v1/health
curl --fail http://localhost:3000/api/v1/health/capabilities
```

Ne publiez pas les sorties de diagnostic contenant des données de requête. Les commandes ci-dessus ne nécessitent aucun affichage de valeur d'environnement.

## Google Cloud Run

1. Créer une base PostgreSQL et stocker chaque variable requise dans Secret Manager.
2. Construire et publier l'image dans Artifact Registry.
3. Déployer le conteneur en laissant Cloud Run fournir `PORT` et en définissant les secrets par références Secret Manager, jamais par leur valeur dans l'historique du terminal.
4. Accorder au service uniquement les droits de lecture des secrets utilisés.
5. Vérifier les sondes `/api/v1/health` et `/api/v1/health/capabilities` après déploiement.

Le conteneur écoute sur `PORT` (3000 par défaut). Les migrations s'exécutent avant le serveur ; une migration en échec empêche le démarrage.

## Hugging Face Spaces

Utiliser un Space Docker et exposer le port 7860. Définir `PORT=7860` dans les variables du Space et injecter les secrets requis via les paramètres secrets du Space. Ne pas placer de secret dans le Dockerfile ou dans les fichiers du dépôt.

## PostgreSQL sur Neon ou Supabase

- Fournir à `DATABASE_URL` une URL PostgreSQL complète ; ne pas reconstituer les connexions depuis des variables `DB_HOST`, `DB_USER` ou équivalentes.
- Le conteneur exécute les migrations au démarrage : utiliser une connexion directe compatible avec les migrations Prisma. Éviter une URL transaction-pooler pour `DATABASE_URL`.
- Sauvegarder la base avant une mise à jour de schéma et vérifier le statut de `prisma migrate deploy`.
- Restreindre l'accès réseau et les rôles de base aux permissions minimales nécessaires.

## Exposition via Cloudflare Tunnel

Faire pointer le tunnel vers le port local du conteneur (par exemple `http://localhost:3000`). Terminer TLS au niveau du tunnel et définir `FRONTEND_URL`, `APP_URL` et `PUBLIC_VERIFY_URL` avec les origines publiques réellement utilisées. Le tunnel ne remplace ni l'authentification, ni la validation des signatures Stripe.

## Retour arrière

1. Arrêter le déploiement courant et redéployer l'image applicative précédente.
2. Vérifier `/api/v1/health` et `/api/v1/health/capabilities`.
3. Les migrations Prisma ne sont pas automatiquement annulées. Si un schéma a été modifié de façon destructive, restaurer une sauvegarde PostgreSQL approuvée avant de relancer l'ancienne image.
4. Ne pas supprimer une migration déjà appliquée ; les corrections de schéma doivent être ajoutées dans une nouvelle migration.
