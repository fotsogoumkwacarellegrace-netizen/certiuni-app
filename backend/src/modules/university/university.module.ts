import { Module } from '@nestjs/common';
import { UniversityCatalogueModule } from '../university-catalogue/university-catalogue.module';
import { UniversityProgramsModule } from '../university-programs/university-programs.module';

@Module({
  imports: [UniversityCatalogueModule, UniversityProgramsModule],
})
export class UniversityModule {}
