import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Active la validation automatique des DTOs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Active CORS pour permettre au frontend de faire des requêtes au backend
    app.enableCors();

    // Préfixe global pour toutes les routes API (ex: http://localhost:3000/api/v1/auth/login)
    app.setGlobalPrefix('api/v1');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Le backend NestJS tourne sur : http://localhost:${port}/api/v1`);
}
bootstrap();