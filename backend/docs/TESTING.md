# ###########################################################
# CertiUni Backend — Comprehensive Testing Strategy
# ###########################################################

> Last verified: `npm run test:unit` → **8 suites / 46 tests ✅**

## 1. Test layers

| Layer           | Config                      | Match                                | DB needed |
|-----------------|-----------------------------|--------------------------------------|-----------|
| Unit            | `jest.unit.config.js`       | `tests/unit/**/*.spec.ts`            | No (mocks)|
| Integration     | `jest.integration.config.js`| `tests/integration/**/*.spec.ts`     | Yes (PG)  |
| E2E (legacy)    | `test/jest-e2e.json`        | `test/**/*.e2e-spec.ts`              | Yes       |

Commands:

```bash
npm run test:unit          # fast, no DB — gate CI
npm run test:unit:cov      # + coverage (thresholds: branches 50 / fn 55 / lines 60)
npm run test:integration   # needs DATABASE_URL on test PG
npm run test:e2e           # legacy Nest e2e (passWithNoTests)
```

> NOTE: `tests/intergration/` (typo) is legacy — do not add files there.
> Canonical dir is `tests/integration/`.

## 2. Coverage map (unit, current)

| Spec file                | Covers                                              |
|--------------------------|-----------------------------------------------------|
| `crypto.util.spec.ts`    | `common/utils/crypto.util.ts` (sha256/hmac/salt)    |
| `crypto-service.spec.ts` | `services/crypto.service.ts` (canonical hash)       |
| `jwt.spec.ts`            | `lib/jwt.ts` (sign/verify roundtrip, tamper)        |
| `qr-utils.spec.ts`       | `common/utils/qr.util.ts` (dataURL/PNG buffer)      |
| `http-helpers.spec.ts`   | `responseFormatter` + `catchAsync` + `HttpError`    |
| `http-filter.spec.ts`    | `HttpExceptionFilter` (Prisma P2002/P2025, 500)     |
| `app.error.spec.ts`      | `errors/app.error.ts` hierarchy                     |
| `errors.spec.ts`         | error status mapping (`fail` vs `error`)            |

Gaps to close next (priority): `auth.middleware` (JWT reject paths),
`globalErrorHandler` (Zod/Prisma/JWT branches), `PrismaService.ping`,
`health.controller`, `guards` (jwt-auth, roles), `interceptors`.

## 3. Rules for new tests

- Pure logic → unit test, no Nest `Test.createTestingModule` needed.
- DB/Redis/HTTP → integration test with containers (`docker compose up -d`).
- Every `AppError` branch must assert `{ statusCode, status, message }`.
- Every Prisma `P2002/P2025/P2003` mapping must be asserted via the filter.
- Mock `jsonwebtoken` secrets in tests — never real prod secrets.

## 4. CI gates (`.github/workflows/backend-ci.yml`)

`lint` → `type-check` → `security` (npm audit + Snyk, non-blocking) →
`unit-tests` (PG service + `prisma db push` + `test:cov` + Codecov) →
`e2e-tests` (PG + Redis + `test:e2e`) → `build` (Docker Buildx).
