import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(dto: CreateServiceDto): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findAll(includeInactive?: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }[]>;
    findByCode(code: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findOne(id: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
}
