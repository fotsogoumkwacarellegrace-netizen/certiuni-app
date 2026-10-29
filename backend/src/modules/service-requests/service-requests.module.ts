import { Module } from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.services';
import { ServiceRequestsController } from './service-requests.controller';

@Module({
    controllers: [ServiceRequestsController],
    providers: [ServiceRequestsService],
    exports: [ServiceRequestsService],
})
export class ServiceRequestsModule { }