import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config & Common
// Verify exported names in ./config/database and ./config/env.config
import { DatabaseConfig } from './config/database';
import validateEnv from './config/env.config';
import { PrismaModule } from './common/prisma/prisma.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// -----------------------------------------------------------------------------
// IMPORTATION DES 31 MODULES OFFICIELS
// -----------------------------------------------------------------------------
import { AuthModule } from './modules/auth/auth.module';                           // 1
import { UsersModule } from './modules/users/users.module';                         // 2
import { RolesModule } from './modules/roles/roles.module';                         // 3
import { PermissionsModule } from './modules/permissions/permissions.module';       // 4
import { AccessModule } from './modules/access/access.module';                     // 5
import { InstitutionsModule } from './modules/institutions/institutions.module';     // 6 (ex-UniversitiesModule)
import { InstitutionUsersModule } from './modules/institution-users/institution-users.module'; // 7
import { ProgramsModule } from './modules/programs/programs.module';                 // 8
import { AcademicLevelsModule } from './modules/academic-levels/academic-levels.module'; // 9
import { AcademicYearsModule } from './modules/academic-years/academic-years.module';   // 10
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';         // 11
import { StudentsModule } from './modules/students/students.module';                 // 12
import { DocumentTypesModule } from './modules/document-types/document-types.module'; // 13
import { DocumentsModule } from './modules/documents/documents.module';             // 14
import { FilesModule } from './modules/files/files.module';                         // 15
import { VerificationModule } from './modules/verification/verification.module';     // 16
import { ServicesModule } from './modules/services/services.module';                 // 17
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module'; // 18
import { TariffsModule } from './modules/tariffs/tariffs.module';                     // 19
import { PaymentsModule } from './modules/payments/payments.module';                 // 20
import { NotificationsModule } from './modules/notifications/notifications.module'; // 21
import { AuditModule } from './modules/audit/audit.module';                         // 22
import { HealthModule } from './modules/health/health.module';                       // 23
import { OrganizationsModule } from './modules/organizations/organizations.module'; // 24
import { IntegrationsModule } from './modules/integrations/integrations.module';     // 25
import { UploadsModule } from './modules/uploads/uploads.module';                     // 26
import { BatchModule } from './modules/batch/batch.module';                         // 27
import { VerifyModule } from './modules/verify/verify.module';                       // 28
import { TemplatesModule } from './modules/templates/templates.module';               // 29
import { AcademicModule } from './modules/academic/academic.module';                 // 30
import { RequestsModule } from './modules/requests/requests.module';                 // 31

@Module({
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
          password: configService.get<string>('REDIS_PASSWORD', ''),
        },
      }],
    })

    // 4. Persistence de données globale
    PrismaModule,

    // 5. Enregistrement des 31 modules métier
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
    OrganizationsModule,
    IntegrationsModule,
    UploadsModule,
    BatchModule,
    VerifyModule,
    TemplatesModule,
    AcademicModule,
    RequestsModule,
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