import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MfaService } from './mfa.service';
import { MfaController } from './mfa.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { env } from '../../config/env.config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController, MfaController],
  providers: [
    AuthService,
    MfaService,
    ...(env.JWT_ACCESS_SECRET ? [JwtStrategy] : []),
    JwtAuthGuard,
  ],
  exports: [AuthService, MfaService, JwtAuthGuard, JwtModule, PassportModule],
})
export class AuthModule { }