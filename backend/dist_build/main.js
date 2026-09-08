"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const port = configService.get('PORT', 3000);
    const environment = configService.get('NODE_ENV', 'development');
    if (process.platform !== 'win32') {
        app.enableShutdownHooks();
    }
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use((0, compression_1.default)());
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:4200');
    const allowedOrigins = frontendUrl.split(',').map((origin) => origin.trim());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                callback(null, true);
            }
            else {
                callback(new Error(`Origine CORS non autorisée : ${origin}`));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const isSwaggerEnabled = configService.get('SWAGGER_ENABLE', true);
    if (environment !== 'production' || isSwaggerEnabled) {
        const swaggerPath = configService.get('SWAGGER_PATH', 'docs');
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('CertiUni Platform API')
            .setDescription('Spécification OpenAPI du moteur de certification académique, émission, vérification immuable et gestion des universités.')
            .setVersion('1.0.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Saisissez votre token Access JWT',
            in: 'header',
        }, 'JWT-auth')
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
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup(swaggerPath, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                docExpansion: 'none',
                filter: true,
            },
            customSiteTitle: 'CertiUni API Documentation',
        });
        logger.log(`📄 Documentation Swagger accessible sur : http://localhost:${port}/${swaggerPath}`);
    }
    await app.listen(port);
    logger.log(`🚀 Serveur CertiUni exécuté en mode [${environment}] sur le port : ${port}`);
    logger.log(`🔗 API Base URL : http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map