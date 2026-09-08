import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database';
import {appConfig,  validateEnv } from './config/env.config';

// Config
import { envConfig } from './config/env';

// Common
import { PrismaModule } from './common/prisma/prisma.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Business Modules
// Importation des 23 modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AccessModule } from './modules/access/access.module';
import { UniversitiesModule } from './modules/institutions/institutions.module';
import { InstitutionUsersModule } from './modules/institution-users/institution-users.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { AcademicLevelsModule } from './modules/academic-levels/academic-levels.module';
import { AcademicYearsModule } from './modules/academic-years/academic-years.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { StudentsModule } from './modules/students/students.module';
import { DocumentTypesModule } from './modules/document-types/document-types.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FilesModule } from './modules/files/files.module';
import { VerificationModule } from './modules/verification/verification.module';
import { ServicesModule } from './modules/services/services.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { TariffsModule } from './modules/tariffs/tariffs.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Verrouille tout par défaut
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,   // Vérifie les rôles si @Roles() est présent
    },
  ],
  
  imports: [
    // 1. Configuration Globale de l'Environnement
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validate: validateEnv, // Bloque le démarrage si des variables obligatoires manquent
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
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

    // Enregistrement des modules
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AccessModule,
    InstitutionsModule,
    InstitutionUsersModule,
    ProgramsModule,
    AcademicLevelsModule,
    AcademicYearsModule,
    EnrollmentsModule,
    StudentsModule,
    DocumentTypesModule,
    DocumentsModule,
    FilesModule,
    VerificationModule,
    ServicesModule,
    ServiceRequestsModule,
    TariffsModule,
    PaymentsModule,
    NotificationsModule,
    AuditModule,
    HealthModule,
    
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