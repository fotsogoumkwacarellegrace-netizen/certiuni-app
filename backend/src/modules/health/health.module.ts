import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { IntegrationsModule } from '../integrations/integrations.module';

/**
 * HealthModule — expose GET /api/v1/health (via préfixe global + versioning).
 * Dépend de PrismaModule (global) pour le ping DB.
 */
@Module({
    imports: [TerminusModule, PrismaModule, IntegrationsModule],
    controllers: [HealthController],
})
export class HealthModule { }