/**
 * AuthModule NestJS (imports: PrismaModule, PassportModule, JwtModule.register).
 *
 * En Express, le routeur d'authentification est montre directement dans
 * `server.ts` (sur `/api/v1/auth`). Ce module ne fait plus qu'exporter le
 * routeur afin de garder un point d'import stable.
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { jwtConfig from } '../config/jwt.config';


@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secretKeyByDefault'),
        signOptions: { expiresIn: '15m' },
      }),
      configService.get('jwt')!,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule, PassportModule],
})
export class AuthModule {}