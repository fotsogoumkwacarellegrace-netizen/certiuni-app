/**
 * AuthModule NestJS (imports: PrismaModule, PassportModule, JwtModule.register).
 *
 * En Express, le routeur d'authentification est montre directement dans
 * `server.ts` (sur `/api/v1/auth`). Ce module ne fait plus qu'exporter le
 * routeur afin de garder un point d'import stable.
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secretKeyByDefault'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}