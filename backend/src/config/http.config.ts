import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

export function configureHttp(app: INestApplication, frontendUrls: string): void {
    app.getHttpAdapter().getInstance().set('trust proxy', true);
    app.use(helmet());
    app.use(cookieParser());

    const allowedOrigins = frontendUrls.split(',').map((origin) => origin.trim());

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
}
