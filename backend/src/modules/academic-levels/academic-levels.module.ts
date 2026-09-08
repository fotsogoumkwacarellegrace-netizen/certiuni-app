import { Module } from '@nestjs/common';
import { AcademicLevelsService } from './academic-levels.service';
import { AcademicLevelsController } from './academic-levels.controller';

@Module({
    controllers: [AcademicLevelsController],
    providers: [AcademicLevelsService],
    exports: [AcademicLevelsService],
})
export class AcademicLevelsModule { }