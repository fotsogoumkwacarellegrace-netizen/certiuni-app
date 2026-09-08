import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { PublicVerifyModule } from './public-verify/public-verify.module';

@Module({
    imports: [
        // Charge les variables d'environnement du fichier .env
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        CertificatesModule,
        PublicVerifyModule,
    ],
})
export class AppModule { }