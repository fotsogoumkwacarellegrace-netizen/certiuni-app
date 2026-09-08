import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
export declare class DocumentTypesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly documentTypeSelect;
    create(dto: CreateDocumentTypeDto): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    findAll(): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    findByCode(code: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    update(id: string, dto: UpdateDocumentTypeDto): Promise<{
        description: string | null;
        code: string;
        name: string;
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
