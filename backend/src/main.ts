import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// compression disabled (not installed);
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
    // 1. Instanciation du serveur NestJS
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');
    const port = configService.get<number>('PORT', 3000);
    const environment = configService.get<string>('NODE_ENV', 'development');

    // Arrêt propre (graceful shutdown) hors environnement Windows
    if (process.platform !== 'win32') {
        app.enableShutdownHooks();
    }

    // 2. Préfixe Global de l'API & Versionning URI
    app.setGlobalPrefix('api');
    // App Versioning disabled (route conflicts on AuthController POST /login —
    // controllers already hardcode 'v1' in their @Controller() path)
    // app.enableVersioning({
    //     type: VersioningType.URI,
    //     defaultVersion: '1',
    // });

    // 3. Middlewares Globaux de Sécurité & Performance
    app.use(helmet());
    app.use(cookieParser());
    // app.use(compression()) // disabled;

    // 4. Configuration CORS Dynamique
    const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:4200');
    const allowedOrigins = frontendUrl.split(',').map((origin) => origin.trim());

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                callback(null, true);
            } else {
                callback(new Error(`Origine CORS non autorisée : ${origin}`));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    // 5. Validation Globale des DTOs (Data Transfer Objects)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Supprime les propriétés non déclarées dans les DTOs
            forbidNonWhitelisted: true, // Rejette les payloads avec des champs inconnus
            transform: true, // Convertit automatiquement les types (ex: string vers number)
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // 6. Configuration de la Documentation Swagger / OpenAPI
    const isSwaggerEnabled = configService.get<boolean>('SWAGGER_ENABLE', true);
    if (environment !== 'production' || isSwaggerEnabled) {
        const swaggerPath = configService.get<string>('SWAGGER_PATH', 'docs');

        const swaggerConfig = new DocumentBuilder()
            .setTitle('CertiUni Platform API')
            .setDescription(
                'Spécification OpenAPI du moteur de certification académique, émission, vérification immuable et gestion des universités.',
            )
            .setVersion('1.0.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    description: 'Saisissez votre token Access JWT',
                    in: 'header',
                },
                'JWT-auth',
            )
            // Tags structurés pour les 31 modules
            .addTag('1. Auth', "Authentification, sessions et gestion des tokens")
            .addTag('2. Users & Roles', "Gestion des utilisateurs, rôles, permissions et accès")
            .addTag('3. Academic Structure', "Institutions, filières, niveaux et années académiques")
            .addTag('4. Students & Registries', "Profils étudiants et registre des inscriptions")
            .addTag('5. Documents & Certificates', "Types de documents, émission, fichiers et templates")
            .addTag('6. Verification & Public', "Moteur de vérification publique et contrôle par QR Code")
            .addTag('7. Services & Requests', "Catalogue de prestations et demandes des étudiants")
            .addTag('8. Finance & Tariffs', "Grilles tarifaires et passerelles de paiement")
            .addTag('9. System & Operations', "Audit, notifications, santé serveur, batchs et intégrations")
            .build();

        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup(swaggerPath, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                docExpansion: 'none',
                filter: true,
            },
            customSiteTitle: 'CertiUni API Documentation',
        });

        logger.log(`📄 Documentation Swagger accessible sur : http://localhost:${port}/${swaggerPath}`);
    }

    // 7. Démarrage du serveur HTTP
    await app.listen(port);
    logger.log(`🚀 Serveur CertiUni exécuté en mode [${environment}] sur le port : ${port}`);
    logger.log(`🔗 API Base URL : http://localhost:${port}/api/v1`);
}

bootstrap();