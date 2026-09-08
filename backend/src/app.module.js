"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const bullmq_1 = require("@nestjs/bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("./config/database");
const env_config_1 = __importDefault(require("./config/env.config"));
const prisma_module_1 = require("./common/prisma/prisma.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const reponse_transform_interceptor_1 = require("./common/interceptors/reponse-transform.interceptor");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const access_module_1 = require("./modules/access/access.module");
const universities_module_1 = require("./modules/universities/universities.module");
const university_users_module_1 = require("./modules/university-users/university-users.module");
const programs_module_1 = require("./modules/programs/programs.module");
const academic_levels_module_1 = require("./modules/academic-levels/academic-levels.module");
const academic_years_module_1 = require("./modules/academic-years/academic-years.module");
const enrollments_module_1 = require("./modules/enrollments/enrollments.module");
const students_module_1 = require("./modules/students/students.module");
const document_types_module_1 = require("./modules/document-types/document-types.module");
const documents_module_1 = require("./modules/documents/documents.module");
const files_module_1 = require("./modules/files/files.module");
const verification_module_1 = require("./modules/verification/verification.module");
const services_module_1 = require("./modules/services/services.module");
const service_requests_module_1 = require("./modules/service-requests/service-requests.module");
const tariffs_module_1 = require("./modules/tariffs/tariffs.module");
const payments_module_1 = require("./modules/payments/payments.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const audit_module_1 = require("./modules/audit/audit.module");
const health_module_1 = require("./modules/health/health.module");
const organization_module_1 = require("./modules/organization/organization.module");
const integrations_module_1 = require("./modules/integrations/integrations.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const batch_module_1 = require("./modules/batch/batch.module");
const verify_module_1 = require("./modules/verify/verify.module");
const templates_module_1 = require("./modules/templates/templates.module");
const academic_module_1 = require("./modules/academic/academic.module");
const requests_module_1 = require("./modules/requests/requests.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_1.databaseConfig],
                validate: env_config_1.default,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbConfig = configService.get('database');
                    if (!dbConfig) {
                        throw new Error('Database configuration is missing');
                    }
                    return dbConfig;
                },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => [
                    {
                        ttl: configService.get('THROTTLE_TTL', 60000),
                        limit: configService.get('THROTTLE_LIMIT', 100),
                    },
                ],
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD', ''),
                    },
                }),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            access_module_1.AccessModule,
            universities_module_1.UniversitiesModule,
            university_users_module_1.UniversityUsersModule,
            programs_module_1.ProgramsModule,
            academic_levels_module_1.AcademicLevelsModule,
            academic_years_module_1.AcademicYearsModule,
            enrollments_module_1.EnrollmentsModule,
            students_module_1.StudentsModule,
            document_types_module_1.DocumentTypesModule,
            documents_module_1.DocumentsModule,
            files_module_1.FilesModule,
            verification_module_1.VerificationModule,
            services_module_1.ServicesModule,
            service_requests_module_1.ServiceRequestsModule,
            tariffs_module_1.TariffsModule,
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
            audit_module_1.AuditModule,
            health_module_1.HealthModule,
            organization_module_1.OrganizationModule,
            integrations_module_1.IntegrationsModule,
            uploads_module_1.UploadsModule,
            batch_module_1.BatchModule,
            verify_module_1.VerifyModule,
            templates_module_1.TemplatesModule,
            academic_module_1.AcademicModule,
            requests_module_1.RequestsModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: reponse_transform_interceptor_1.ResponseTransformInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map