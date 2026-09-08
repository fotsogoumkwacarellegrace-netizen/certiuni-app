import { ValidationPipe, VersioningType,  } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as compression from 'compression';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

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

    // Configuration CORS
    const frontendUrl = configService.get<string>('FRONTEND_URL');
    const allowedOrigins = frontendUrl ? frontendUrl.split(',') : ['http://localhost:3000', 'http://localhost:5173'];

    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    });

    // Pipes de validation globale DTO
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Configuration Swagger UI sur /api/docs
    const swaggerConfig = new DocumentBuilder()
        .setTitle('CertiUni API')
        .setDescription('Documentation officielle de l’API backend CertiUni')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    // Démarrage du serveur HTTP sur 0.0.0.0
    const port = configService.get<number>('PORT', 3000);
    await app.listen(3000);

    console.log(`🚀 CertiUni backend démarré sur http://localhost:${port}`);
    console.log(`📍 Health check: http://localhost:${port}/api/v1/health`);
    console.log(`📚 Documentation Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();