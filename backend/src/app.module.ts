import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Config & Common
// Verify exported names in ./config/database and ./config/env.config
import { env, validateEnv } from './config/env.config';
import { PrismaModule } from './common/prisma/prisma.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/reponse-transform.interceptor';
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
import { UniversitiesModule } from './modules/universities/universities.module';               // 6 (ex-InstitutionsModule)
import { UniversityUsersModule } from './modules/university-users/university-users.module'; // 7
import { ProgramsModule } from './modules/programs/programs.module';                 // 8
import { UniversityProgramsModule } from './modules/university-programs/university-programs.module'; // UNI-03 Gestion programmes/filières
import { AcademicLevelsModule } from './modules/academic-levels/academic-levels.module'; // 9
import { AcademicYearsModule } from './modules/academic-years/academic-years.module';   // 10
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';         // 11
import { StudentsModule } from './modules/students/students.module';                 // 12
import { StudentDashboardModule } from './modules/student-dashboard/student-dashboard.module'; // ETU-02 Tableau de bord étudiant
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
import { OrganizationModule } from './modules/organization/organization.module'; // 24
import { IntegrationsModule } from './modules/integrations/integrations.module';     // 25
import { UploadsModule } from './modules/uploads/uploads.module';                     // 26
import { BatchModule } from './modules/batch/batch.module';                         // 27
import { PdfModule } from './modules/pdf/pdf.module';                               // 28 (génération PDF / S3)
import { VerifyModule } from './modules/verify/verify.module';                       // 28
import { TemplatesModule } from './modules/templates/templates.module';               // 29
import { AcademicModule } from './modules/academic/academic.module';                 // 30
import { RequestsModule } from './modules/requests/requests.module';                 // 31
import { InstitutionModule } from './modules/institution/institution.module';       // ADM: Gestion institutions, comptes, sécurité
import { UniversityCatalogueModule } from './modules/university-catalogue/university-catalogue.module';
import { UniversityStatusModule } from './modules/university-status/university-status.module';
import { RecruiterTrackingModule } from './modules/recruiter-tracking/recruiter-tracking.module';
import { SuperAdminDashboardModule } from './modules/super-admin-dashboard/super-admin-dashboard.module';
import { SecurityConfigurationModule } from './modules/security-configuration/security-configuration.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { DocumentGovernanceModule } from './modules/document-governance/document-governance.module';
import { RecruiterModule } from './modules/recruiter/recruiter.module';
import { UniversityModule } from './modules/university/university.module';

@Module({
  imports: [
    // 1. Configuration Globale de l'Environnement
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => env],
      validate: validateEnv, // Bloque le démarrage si des variables obligatoires manquent
    }),

    // 2. Protection contre les attaques Brute-Force / Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: env.THROTTLE_TTL,
        limit: env.THROTTLE_LIMIT,
      },
    ]),

    // 3. Persistence de données globale
    PrismaModule,

    // 4. Enregistrement des modules métier
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AccessModule,
    UniversitiesModule,
    UniversityUsersModule,
    UniversityProgramsModule, // UNI-03 Gestion programmes/filières
    UniversityCatalogueModule, // UNI-04 Catalogue de services
    UniversityStatusModule, // UNI-09 Transitions de statut (partiel)
    RecruiterTrackingModule, // REC-07 Suivi traitement, REC-08 Vérification complémentaire
    SuperAdminDashboardModule, // ADM-05 Interface supervision/dashboard (partiel)
    ProgramsModule,
    AcademicLevelsModule,
    AcademicYearsModule,
    EnrollmentsModule,
    StudentsModule,
    StudentDashboardModule, // ETU-02 Tableau de bord étudiant
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
    OrganizationModule,
    IntegrationsModule,
    UploadsModule,
    BatchModule,
    PdfModule,
    VerifyModule,
    TemplatesModule,
    AcademicModule,
    RequestsModule,
    InstitutionModule, // ADM: Gestion institutions, comptes, sécurité
    SecurityConfigurationModule, // ADM-07 à ADM-13 Surveillance services, alertes, paiements, audit, sauvegardes, paramètres globaux
    ReportingModule, // ADM-14 à ADM-17 Rapports globaux, exports, tracing, changements critiques
    DocumentGovernanceModule, // ADM-18 à ADM-23 Statistiques documents, modèles, catalogues, incidents, traçabilité, gestion liens
    RecruiterModule, // REC-01 à REC-16 Espace Recruteur
    UniversityModule, // UNI-01 à UNI-25 Espace Université

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