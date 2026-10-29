# ###########################################################
# CertiUni Backend — Deployment & CI/CD
# ###########################################################

## 1. Pipelines (`.github/workflows/`)

| Workflow          | Trigger                  | Jobs                                                        |
|-------------------|--------------------------|-------------------------------------------------------------|
| `backend-ci.yml`  | push/PR on `backend/**`  | lint → type-check → security → unit-tests → e2e → Docker build |
| `deployment.yml`  | push on `main`           | build & push images → `prisma migrate deploy` → deploy      |
| `frontend-ci.yml` | push/PR on `frontend/**`| frontend gates (untouched by this doc)                      |

Required secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `SNYK_TOKEN`,
`DATABASE_URL` (migrate job), `CODECOV_TOKEN` (optional).

## 2. Docker (production)

Multi-stage `backend/Dockerfile` (node:20-alpine):

1. `builder`: `npm ci` → `prisma generate` → `nest build`.
2. `runner`: `npm ci --only=production` → `prisma generate` →
   copy `dist/` → `migrate deploy` → `node dist/src/main`.

Local parity: `docker-compose.yml` (postgres:16-alpine + redis:7-alpine,
healthchecks, named volumes).

```bash
docker compose up -d postgres redis   # infra only
npm run prisma:migrate:deploy         # migrations
npm run start:prod                    # API
curl -f http://localhost:3000/api/v1/health
```

## 3. Environments

| Env     | DB                              | Migrations        | Swagger | Logs   |
|---------|---------------------------------|-------------------|---------|--------|
| dev     | localhost:5432 direct           | `migrate dev`     | on      | console|
| staging | managed PG, direct :5432        | `migrate deploy`  | on      | JSON   |
| prod    | PgBouncer :6543 + direct :5432  | `migrate deploy` (direct URL) | off unless `SWAGGER_ENABLE=true` | JSON shipped to APM |

## 4. Rollback

- App: redeploy previous image tag (immutable `certiuni/backend:<sha>`).
- DB: forward-fix migration (never `migrate resolve --rolled-back` on prod
  without backup). Snapshot before each deploy (`pg_dump` / managed backup).
