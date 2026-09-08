import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private readonly configService;
    constructor(configService: ConfigService);
    getHealth(): {
        status: string;
        service: string;
        version: string;
        environment: string;
        timestamp: string;
        uptime: string;
    };
    getAppInfo(): {
        name: string;
        description: string;
        version: string;
        documentation: string;
        status: string;
    };
}
