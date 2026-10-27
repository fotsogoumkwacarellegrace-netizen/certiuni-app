import { Module } from '@nestjs/common';
import { TransverseEnginesController } from './transverse-engines.controller';
import { TransverseEnginesService } from './transverse-engines.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TransverseEnginesController],
  providers: [TransverseEnginesService, PrismaService],
  exports: [TransverseEnginesService],
})
export class TransverseEnginesModule {}