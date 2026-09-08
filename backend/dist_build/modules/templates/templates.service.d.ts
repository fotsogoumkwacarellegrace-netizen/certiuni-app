import { PrismaService } from '../../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
export declare class TemplatesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(dto: CreateTemplateDto, user: any): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        layoutConfig: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(user: any): Promise<({
        university: {
            code: string;
            name: string;
            id: string;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        layoutConfig: import("@prisma/client/runtime/library").JsonValue;
    })[]>;
    findOne(id: string, user: any): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        layoutConfig: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(id: string, dto: UpdateTemplateDto, user: any): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        layoutConfig: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string, user: any): Promise<{
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        layoutConfig: import("@prisma/client/runtime/library").JsonValue;
    }>;
    private validateHandlebarsSyntax;
}
