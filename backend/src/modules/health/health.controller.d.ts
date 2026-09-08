import { HealthCheckService, PrismaHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly health;
    private readonly prismaHealth;
    private readonly memory;
    private readonly prisma;
    constructor(health: HealthCheckService, prismaHealth: PrismaHealthIndicator, memory: MemoryHealthIndicator, prisma: PrismaService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
