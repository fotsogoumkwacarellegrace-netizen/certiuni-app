import { Module } from '@nestjs/common';
import { DocumentGovernanceService } from './document-governance.service';
import { DocumentGovernanceController } from './document-governance.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DocumentGovernanceController],
  providers: [DocumentGovernanceService, PrismaService],
  exports: [DocumentGovernanceService],
})
export class DocumentGovernanceModule {}