# ###########################################################
# CertiUni Backend — Logging & Monitoring (APM-ready)
# ###########################################################

## 1. Structured logging (Winston)

Single entrypoint: `src/common/utils/logger.util.ts`.

- `winston.createLogger` singleton (`service: 'certiuni-api'`, `environment`, `pid`).
- Transports: `DailyRotateFile logs/application-%DATE%.log` (14d, 20m, zipped)
  + `logs/error-%DATE%.log` (30d) + Console (non-prod, colorized).
- Prod format = JSON (machine-readable, APM-shippable). Dev = colorized text.
- `StructuredLogger` (Nest `LoggerService`, TRANSIENT) exposes
  `log/error/warn/debug/verbose` with optional `context` + `meta`.

Consumers: `requestLogging.middleware.ts` (HTTP access logs),
`middlewares/error.middleware.ts` (error logs), business services
(Audit, Payment, Email, Notification).

```ts
import logger from './common/utils/logger.util';
logger.info('Certificate issued', { certificateId, universityId });
logger.error('Payment failed', { orderId, reason });
```

Every request carries `X-Correlation-Id` (see `correlationId.middleware.ts`);
error responses echo `correlationId` for distributed traceability.

## 2. Log levels policy

| Level   | Usage                                              |
|---------|----------------------------------------------------|
| `error` | 5xx, unhandled, Prisma connect fail, payment fail  |
| `warn`  | 4xx client errors, deprecated paths, retry         |
| `info`  | HTTP access, lifecycle (boot/shutdown), jobs done  |
| `debug` | SQL queries (dev only), DTO dumps (never secrets)  |

Never log: passwords, hashes, JWTs, card data, full PII bundles.

## 3. APM for production

No vendor SDK is bundled yet — the logger is already JSON so any shipper works:

- **Option A (managed):** Datadog Agent / Elastic APM / New Relic —
  tail `logs/*.log` or stdout, parse JSON, alert on `level: error` rate.
- **Option B (K8s):** stdout JSON + Fluent Bit → Loki/Elasticsearch.
- Key SLO signals: `HttpRequest` `durationMs` p95, 5xx rate, `Prisma connect failed`,
  BullMQ failed-job count, health-check `DOWN` transitions.

Minimal env knobs to add when enabling APM:

```dotenv
APM_ENABLED=true
APM_SERVICE_NAME=certiuni-backend
APM_ENVIRONMENT=production
LOG_LEVEL=info
```

Health probes for orchestrators: `GET /api/v1/health`
(Terminus: DB `SELECT 1` + heap 300MB + RSS 500MB → `200`/`503`).

## 4. Retention & rotation

Daily rotation, gzip, `20m` per file, `14d` app / `30d` errors.
In containers prefer stdout + external retention over in-image `logs/`.
