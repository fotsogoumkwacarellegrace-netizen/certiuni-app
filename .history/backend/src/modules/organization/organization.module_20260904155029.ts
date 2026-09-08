import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
    controllers: [OrganizationController],
    providers: [OrganizationService],
    exports: [OrganizationService],
})
export class OrganizationModule { }