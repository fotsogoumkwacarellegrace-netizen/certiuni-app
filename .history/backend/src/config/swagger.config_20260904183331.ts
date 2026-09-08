import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('CertiUni API')
    .setDescription('API de certification, vérification et gestion des diplômes universitaires')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Saisissez le token JWT d\'accès',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentification et gestion des sessions')
    .addTag('Certificates', 'Émission, consultation et révocation des diplômes')
    .addTag('Verification', 'Portail public de vérification par QR code / Hash')
    .addTag('Requests', 'Demandes de réémissions et de copies certifiées')
    .addTag('Universities', 'Gestion des établissements affiliés (Tenants)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
    customSiteTitle: 'CertiUni API Documentation',
  });
}