# ###########################################################
# CertiUni Backend — Database Schema & Migration Strategy
# ###########################################################

> Single source of truth: `prisma/schema.prisma` (+ `prisma/migrations/*`).
> Last verified: `npx prisma validate` ✅ · `npx tsc --noEmit --skipLibCheck` ✅

## 1. Stack & topology

| Layer            | Choice                                     |
|------------------|--------------------------------------------|
| ORM              | Prisma 5 (`@prisma/client` + `prisma` CLI) |
| DB               | PostgreSQL 16 (`postgres:16-alpine`)       |
| Dev topology     | Direct TCP `localhost:5432`                |
| Prod topology    | PgBouncer `:6543` (pool) + direct `:5432` for migrations |
| Client output    | `node_modules/.prisma/client` (default)    |
| Multi-tenancy    | `University` is the tenant root (`universityId` FK on scoped models) |

`prisma/schema.prisma` datasource uses **only** `env("DATABASE_URL")`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

`DIRECT_URL` / `previewFeatures` were removed (Prisma 5 stable).

## 2. Migration workflow (the only supported flow)

```bash
# 1. edit prisma/schema.prisma
# 2. dev loop (creates SQL + applies locally)
npx prisma migrate dev --name <snake_case_change>
# 3. review generated SQL under prisma/migrations/<ts>_<name>/migration.sql
# 4. regenerate + typecheck + test
npx prisma generate
npm run typecheck
npm run test:unit
# 5. production deploy (CI `migrate` job, NEVER `db push`)
npx prisma migrate deploy
```

Rules:

- `migrate dev` → local/dev only. `migrate deploy` → staging/prod.
- Never hand-edit applied migrations. New change = new migration.
- `migration_lock.toml` pins `provider = "postgresql"`.
- Baseline migrations kept:
  - `20260903140335_init_new_schema`
  - `20260906205813_add_tariffs_and_update_verification_schema`
- Empty/drifted `prisma/migrations/*` folders must be deleted or squashed
  with `prisma migrate diff` — a folder without `migration.sql` breaks deploy.

## 3. Connection strings

```dotenv
# dev (direct)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/certiuni_dev?schema=public"
# prod (pooled runtime; PgBouncer transaction mode)
DATABASE_URL="postgresql://USER:PASS@pgbouncer:6543/certiuni_db?schema=public&pgbouncer=true&connection_limit=20"
# prod migrations (bypass pool — direct postgres)
# run: DATABASE_URL="<direct :5432 URL>" npx prisma migrate deploy
```

`src/config/database.ts` rebuilds a fallback URL from `DB_HOST/PORT/USER/PASS/NAME`
if `DATABASE_URL` is missing, and re-exports the `src/lib/prisma.ts` singleton
for legacy `from '../config/database'` imports.

## 4. Seed

- `prisma/seeds/seed.ts` (wired in `package.json`: `"prisma": { "seed": ... }`).
- Idempotent `upsert`s: document types → university `UY1` → program/level/year →
  roles → users (bcrypt cost 12) → student → service/pricing → template.
- Run: `npm run seed`. CI never seeds prod automatically.

## 5. Health & observability of the DB

- `PrismaService.ping()` (`SELECT 1`) feeds Terminus `/api/v1/health`.
- Logs: Prisma `['query',...]` in dev, `['error']` only in prod.
- Slow-query watch: enable `log: [{ emit:'event', level:'query' }]` + APM timer
  if p95 justifies it (see `docs/LOGGING-MONITORING.md`).

## 6. Troubleshooting

| Symptom                              | Fix                                                        |
|--------------------------------------|------------------------------------------------------------|
| `P1001 can't reach DB`               | `docker compose up -d postgres`, check `DATABASE_URL`      |
| `P3005 database schema is not empty` | baseline with `migrate resolve --applied <name>` then retry|
| `P2002 unique violation` in seed     | expected on rerun — `upsert` handles it; check `@@unique`  |
| Pool exhaustion (`too many clients`) | lower `DB_POOL_MAX`, enable PgBouncer, check leaks         |
