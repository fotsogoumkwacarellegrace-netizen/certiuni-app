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
        description: string | null;
        name: string;
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
        description: string | null;
        name: string;
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
        description: string | null;
        name: string;
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
        description: string | null;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        layoutConfig: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string, user: any): Promise<{
        description: string | null;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        layoutConfig: import("@prisma/client/runtime/library").JsonValue;
    }>;
    private validateHandlebarsSyntax;
}
