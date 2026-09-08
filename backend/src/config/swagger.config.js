"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CertiUni API')
        .setDescription('API de certification, vérification et gestion des diplômes universitaires')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Saisissez le token JWT d\'accès',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Auth', 'Authentification et gestion des sessions')
        .addTag('Certificates', 'Émission, consultation et révocation des diplômes')
        .addTag('Verification', 'Portail public de vérification par QR code / Hash')
        .addTag('Requests', 'Demandes de réémissions et de copies certifiées')
        .addTag('Universities', 'Gestion des établissements affiliés (Tenants)')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
        },
        customSiteTitle: 'CertiUni API Documentation',
    });
}
//# sourceMappingURL=swagger.config.js.map