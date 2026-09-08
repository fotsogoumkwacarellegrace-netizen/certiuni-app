import { ServiceRequestsService } from './service-requests.services';
import { CreateRequestDto } from './dto/create-request.dto';
import { ServiceRequestStatus, UpdateRequestStatusDto } from './dto/update-request-status.dto';
export declare class ServiceRequestsController {
    private readonly serviceRequestsService;
    constructor(serviceRequestsService: ServiceRequestsService);
    create(req: any, dto: CreateRequestDto): Promise<any>;
    findMyRequests(req: any): Promise<any>;
    findAll(status?: ServiceRequestStatus): Promise<any>;
    findOne(id: string, req: any): Promise<any>;
    updateStatus(id: string, dto: UpdateRequestStatusDto): Promise<any>;
    cancel(id: string, req: any): Promise<any>;
}
