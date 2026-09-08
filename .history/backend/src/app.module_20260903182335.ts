import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

// Config
import envConfig from './config/env';

// Common
import { PrismaModule } from './common/prisma/prisma.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Business Modules
import { AuthModule } from './modules/auth/auth.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { AcademicModule } from './modules/academic/academic.module';
import { StudentsModule } from './modules/students/students.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { BatchModule } from './modules/batch/batch.module';
import { VerifyModule } from './modules/verify/verify.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { RequestsModule } from './modules/requests/requests.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    // 1. Configuration Globale de l'Environnement
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),

    // 2. Protection contre les attaques Brute-Force / Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60000), // 60 secondes
          limit: configService.get<number>('THROTTLE_LIMIT', 100), // 100 requêtes
        },
      ],
    }),

    // 3. Connexion globale Redis / BullMQ pour les files d'attente
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', undefined),
        },
      }),
    }),

    // 4. Persistence de données globale
    PrismaModule,

    // 5. Modules Métiers
    AuthModule,
    UniversitiesModule,
    AcademicModule,
    StudentsModule,
    CertificatesModule,
    BatchModule,
    VerifyModule,
    TemplatesModule,
    RequestsModule,
    AuditModule,
  ],
  providers: [
    // Exception Filter Global (Uniformise les réponses d'erreur HTTP)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Interceptor Global (Uniformise les réponses HTTP réussies)
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    // Guard Global JWT (Toutes les routes sont sécurisées par défaut)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Guard Global RBAC (Contrôle d'accès basé sur les rôles)
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Guard Global Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }