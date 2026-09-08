import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
export declare class DocumentTypesController {
    private readonly documentTypesService;
    constructor(documentTypesService: DocumentTypesService);
    create(dto: CreateDocumentTypeDto): Promise<{
        code: string;
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    findAll(): Promise<{
        code: string;
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }[]>;
    findByCode(code: string): Promise<{
        code: string;
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    findOne(id: string): Promise<{
        code: string;
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    update(id: string, dto: UpdateDocumentTypeDto): Promise<{
        code: string;
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    remove(id: string): Promise<{
        code: string;
        name: string;
        id: string;
    }>;
}
