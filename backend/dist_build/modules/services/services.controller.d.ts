import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(dto: CreateServiceDto): Promise<{
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findAll(includeInactive?: string): Promise<{
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }[]>;
    findByCode(code: string): Promise<{
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findOne(id: string): Promise<{
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    remove(id: string): Promise<{
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
}
