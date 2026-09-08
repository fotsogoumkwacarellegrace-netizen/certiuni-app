/**
 * AuthModule NestJS (imports: PrismaModule, PassportModule, JwtModule.register).
 *
 * En Express, le routeur d'authentification est montre directement dans
 * `server.ts` (sur `/api/v1/auth`). Ce module ne fait plus qu'exporter le
 * routeur afin de garder un point d'import stable.
 */
export { default as authRouter } from './auth.controller';
export { default } from './auth.controller';