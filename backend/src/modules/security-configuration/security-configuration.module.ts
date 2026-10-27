import { Module } from '@nestjs/common';
import { SecurityConfigurationService } from './security-configuration.service';
import { SecurityConfigurationController } from './security-configuration.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SecurityConfigurationController],
  providers: [SecurityConfigurationService, PrismaService],
  exports: [SecurityConfigurationService],
})
export class SecurityConfigurationModule {}