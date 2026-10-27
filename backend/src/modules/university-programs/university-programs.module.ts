import { Module } from '@nestjs/common';
import { UniversityProgramsService } from './university-programs.service';
import { UniversityProgramsController } from './university-programs.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UniversityProgramsController],
  providers: [UniversityProgramsService, PrismaService],
  exports: [UniversityProgramsService],
})
export class UniversityProgramsModule {}