import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Importation des middlewares et erreurs
import { globalErrorHandler } from './middlewares/error.middleware';
import { NotFoundError } from './errors/app.error';

// Importation des routeurs correspondant aux 31 modules
import healthRouter from './routes/health.router'; // HealthModule (23)
import authRouter from './routes/V1/auth.router'; // AuthModule (1)
// import usersRouter from './routes/V1/users.router'; // UsersModule (2)
// import rolesRouter from './routes/V1/roles.router'; // RolesModule (3)
// import permissionsRouter from './routes/V1/permissions.router'; // PermissionsModule (4)
// import accessRouter from './routes/V1/access.router'; // AccessModule (5)
// import institutionsRouter from './routes/V1/institutions.router'; // InstitutionsModule (6)
// import institutionUsersRouter from './routes/V1/institution-users.router'; // InstitutionUsersModule (7)
// import programsRouter from './routes/V1/programs.router'; // ProgramsModule (8)
// import academicLevelsRouter from './routes/V1/academic-levels.router'; // AcademicLevelsModule (9)
// import academicYearsRouter from './routes/V1/academic-years.router'; // AcademicYearsModule (10)
// import enrollmentsRouter from './routes/V1/enrollments.router'; // EnrollmentsModule (11)
// import studentsRouter from './routes/V1/students.router'; // StudentsModule (12)
// import documentTypesRouter from './routes/V1/document-types.router'; // DocumentTypesModule (13)
// import documentsRouter from './routes/V1/documents.router'; // DocumentsModule (14)
// import filesRouter from './routes/V1/files.router'; // FilesModule (15)
// import verificationRouter from './routes/V1/verification.router'; // VerificationModule (16)
// import servicesRouter from './routes/V1/services.router'; // ServicesModule (17)
// import serviceRequestsRouter from './routes/V1/service-requests.router'; // ServiceRequestsModule (18)
// import tariffsRouter from './routes/V1/tariffs.router'; // TariffsModule (19)
// import paymentsRouter from './routes/V1/payments.router'; // PaymentsModule (20)
// import notificationsRouter from './routes/V1/notifications.router'; // NotificationsModule (21)
// import auditRouter from './routes/V1/audit.router'; // AuditModule (22)
// import organizationsRouter from './routes/V1/organizations.router'; // OrganizationsModule (24)
// import integrationsRouter from './routes/V1/integrations.router'; // IntegrationsModule (25)
// import uploadsRouter from './routes/V1/uploads.router'; // UploadsModule (26)
// import batchRouter from './routes/V1/batch.router'; // BatchModule (27)
// import verifyRouter from './routes/V1/verify.router'; // VerifyModule (28)
// import templatesRouter from './routes/V1/templates.router'; // TemplatesModule (29)
// import academicRouter from './routes/V1/academic.router'; // AcademicModule (30)
// import requestsRouter from './routes/V1/requests.router'; // RequestsModule (31)

dotenv.config();

const app: Application = express();

// Middlewares globaux
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Route racine d'information
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'CertiUni API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// -------------------------------------------------------------
// Enregistrement des routes pour les 31 modules (/api/v1)
// -------------------------------------------------------------
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/users', usersRouter);
// app.use('/api/v1/roles', rolesRouter);
// app.use('/api/v1/permissions', permissionsRouter);
// app.use('/api/v1/access', accessRouter);
// app.use('/api/v1/institutions', institutionsRouter);
// app.use('/api/v1/institution-users', institutionUsersRouter);
// app.use('/api/v1/programs', programsRouter);
// app.use('/api/v1/academic-levels', academicLevelsRouter);
// app.use('/api/v1/academic-years', academicYearsRouter);
// app.use('/api/v1/enrollments', enrollmentsRouter);
// app.use('/api/v1/students', studentsRouter);
// app.use('/api/v1/document-types', documentTypesRouter);
// app.use('/api/v1/documents', documentsRouter);
// app.use('/api/v1/files', filesRouter);
// app.use('/api/v1/verification', verificationRouter);
// app.use('/api/v1/services', servicesRouter);
// app.use('/api/v1/service-requests', serviceRequestsRouter);
// app.use('/api/v1/tariffs', tariffsRouter);
// app.use('/api/v1/payments', paymentsRouter);
// app.use('/api/v1/notifications', notificationsRouter);
// app.use('/api/v1/audit', auditRouter);
// app.use('/api/v1/organizations', organizationsRouter);
// app.use('/api/v1/integrations', integrationsRouter);
// app.use('/api/v1/uploads', uploadsRouter);
// app.use('/api/v1/batch', batchRouter);
// app.use('/api/v1/verify', verifyRouter);
// app.use('/api/v1/templates', templatesRouter);
// app.use('/api/v1/academic', academicRouter);
// app.use('/api/v1/requests', requestsRouter);

// Catch-all pour les routes non trouvées (DOIT être placé après toutes les routes)
app.all(/^\/?.*/, (req, res, next) => {
    next(new NotFoundError(`La route ${req.originalUrl} n'existe pas.`));
});

// Middleware global de gestion des erreurs
app.use(globalErrorHandler);

export default app;