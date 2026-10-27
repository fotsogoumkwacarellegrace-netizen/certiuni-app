import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) { }

    /**
     * Retourne l'état de santé de base de l'application API
     */
    getHealth() {
        return {
            status: 'ok',
            service: 'CertiUni Backend API',
            version: '1.0.0',
            environment: this.configService.get<string>('NODE_ENV', 'development'),
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(process.uptime())}s`,
        };
    }

    /**
     * Informations de bienvenue et métadonnées du serveur
     */
    getAppInfo() {
        return {
            name: 'CertiUni Platform API',
            description: 'API officielle de vérification et gestion des documents académiques',
            version: '1.0.0',
            documentation: '/docs',
            status: 'online',
        };
    }
}