# ###########################################################
# CertiUni Backend — Security Audit Checklist
# ###########################################################

> For professional auditors + internal pre-audit. Scope: `backend/` only.

## 1. Already enforced (verify in CI)

- [x] Helmet headers + restrictive CSP (`src/app.ts`).
- [x] CORS allowlist from `FRONTEND_URL` (no `*` in prod).
- [x] Global + auth-strict rate limiting (`express-rate-limit`, ThrottlerGuard).
- [x] Global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`).
- [x] JWT access (15m) + refresh (7d), bcrypt cost ≥ 10 (seed: 12).
- [x] Global `JwtAuthGuard` (deny-by-default) + `RolesGuard` (RBAC).
- [x] Unified error contract — stack traces dev-only.
- [x] CI: `npm audit --audit-level=moderate` + Snyk scan (non-blocking).

## 2. Pre-audit hardening TODO (before external audit)

- [ ] Remove `JWT_ACCESS_SECRET` dev fallback in prod (`auth.middleware.ts:61`,
      `lib/jwt.ts:19`) — fail fast if env missing.
- [ ] Rotate `QR_SECRET_KEY`, `TWILIO_*`, `STRIPE_*` — move to secret manager
      (Vault / AWS Secrets Manager), never `.env` in images.
- [ ] Add refresh-token rotation + reuse detection (currently `updateRefreshToken`
      overwrites `passwordHash` — confirm intended store or dedicated table).
- [ ] File uploads: enforce allowlist MIME + size + AV scan before S3 put.
- [ ] SQL: all access via Prisma (no raw) except `SELECT 1` ping.
- [ ] Add security headers test + CORS rejection test to integration suite.
- [ ] Enable `forbidUnknownValues` on all Zod env schemas; `validateEnv` fail-fast.

## 3. Audit evidence pack (give to auditors)

1. `docs/LOGGING-MONITORING.md` + `logs/error-*.log` (30d).
2. `prisma/schema.prisma` + `prisma/migrations/*` (auth-relevant models: `User`, `AuditLog`).
3. `src/modules/auth/*`, `src/middlewares/auth.middleware.ts`, guards.
4. CI runs: lint / typecheck / audit / unit / e2e / Docker build.
5. `npm audit --json` output + Snyk report + Codecov coverage.

## 4. Suggested external scope (critical apps)

- OWASP ASVS L2: auth, session, access control, crypto, error handling.
- Penetration test: login brute-force, JWT tamper/replay, IDOR on
  `universityId` tenant scoping, file-upload bypass, rate-limit bypass.
- Dependency + container scan (`npm audit`, Trivy on final image).
