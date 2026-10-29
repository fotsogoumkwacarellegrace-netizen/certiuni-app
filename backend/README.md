# CertiUni Backend API

Plateforme de certification et vérification de diplômes universitaires au Cameroun.

## Prérequis

- Node.js >= 20.x
- PostgreSQL >= 15
- Redis >= 7
- Prisma CLI

## Installation

```bash
cd backend
npm install
```

## Variables d'environnement

Copier `.env.example` vers `.env` et adapter :

```bash
cp .env.example .env
```

| Variable | Exemple |
|----------|---------|
| `DATABASE_URL` | `postgresql://...@host:5432/db?schema=public` |
| `REDIS_URL` | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | ≥32 caractères |
| `JWT_REFRESH_SECRET` | ≥32 caractères |
| `FRONTEND_URL` | `http://localhost:4200` |
| `AWS_S3_BUCKET` | `certiuni-documents` |

## Base de données

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed  # Données de démo
```

## Démarrage

```bash
npm run dev   # http://localhost:3000 (dev)
npm run build && npm run start:prod  # production
```

## Sécurité

### Auth
- **JWT HS256** : Access token (15 min) + Refresh token (7j)
- **Bcrypt** : Hash mot de passe (coût 12)
- **MFA TOTP** : Double facteur (SPEAKEASY)

### Accès
- **RBAC** : SUPER_ADMIN, UNIV_ADMIN, ISSUER, VERIFIER, STUDENT
- **Multi-tenant** : Isolation par université
- **Rate limiting** : 100 req/60s global, 40 auth/15min

### Headers (Helmet)
CSP, X-Frame-Options, HSTS, Referrer-Policy, Cache-Control

### Cryptographie
- SHA-256 : Empreinte canonique diplômes
- HMAC-SHA256 : Intégrité données
- QR Code : Niveau correction H (30%)

### Audit
- AuditLog : Enregistrements immuables, indexés par userId/universityId/action
