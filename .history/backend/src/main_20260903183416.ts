import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as compression from 'compression';


async function bootstrap() {
    // Création de l'application NestJS
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Éviter l'arrêt prématuré par app.enableShutdownHooks() sous Windows PowerShell
    if (process.platform !== 'win32') {
        app.enableShutdownHooks();
    }

    // Préfixe global pour les routes
    app.setGlobalPrefix('api');

    // Versionning URI (ex: /api/v1/health)
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // Sécurité et middlewares
    app.use(helmet());
    app.use(cookieParser());
    app.use(compression());

    // Configuration CORS
    const frontendUrl = configService.get<string>('FRONTEND_URL');
    const allowedOrigins = frontendUrl ? frontendUrl.split(',') : ['http://localhost:3000', 'http://localhost:5173'];

    // 2. Configuration CORS
    app.enableCors({
        origin: configService.get<string>('CORS_ALLOWED_ORIGINS', '*').split(','),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    // 3. Préfixe Global de l'API
    app.setGlobalPrefix('api/v1');
    
    // Pipes de validation globale DTO
    // 4. Validation Globale des DTOs (Data Transfer Objects)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Supprime les propriétés non déclarées dans les DTOs
            forbidNonWhitelisted: true, // Rejette les requêtes avec des champs non autorisés
            transform: true, // Convertit automatiquement les types des payloads
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Configuration Swagger UI sur /api/docs
    // 5. Configuration de la Documentation Swagger / OpenAPI (Actif sauf en production stricte)
    if (environment !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .setTitle('Academic Certification Engine API')
            .setDescription(
                'Spécification complète de l\'API d\'émission, de vérification et de révocation des diplômes et attestations académiques.',
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
            .addTag('Auth', 'Endpoints d\'authentification et gestion de session')
            .addTag('Certificates', 'Gestion de l\'émission, signature SHA-256 et révocation des certificats')
            .addTag('Verify', 'Endpoints publics de vérification par empreinte immuable')
            .addTag('Universities', 'Gestion des établissements et configurations visuelles')
            .addTag('Students', 'Gestion du registre national/académique des étudiants')
            .addTag('Academic', 'Structures académiques (Années, Niveaux, Filières)')
            .addTag('Batch', 'Importation et émission de masse via fichiers CSV/Excel')
            .addTag('Requests', 'Traitement des demandes d\'attestation par des tiers')
            .addTag('Audit', 'Traçabilité et journalisation immuable des actions')
            .build();
        
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
            customSiteTitle: 'Documentation API Certification',
        });

        logger.log(`Swagger Documentation disponible sur : http://localhost:${port}/docs`);
    }        
    // 6. Démarrage du serveur HTTP
    await app.listen(port);
    logger.log(`🚀 Le serveur backend s'exécute en mode [${environment}] sur le port : ${port}`);
    logger.log(`API disponible sur : http://localhost:${port}/api/v1`);
}


bootstrap();