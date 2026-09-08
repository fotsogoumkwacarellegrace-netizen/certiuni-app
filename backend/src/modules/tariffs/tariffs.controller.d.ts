import { TariffsService } from './tariffs.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
export declare class TariffsController {
    private readonly tariffsService;
    constructor(tariffsService: TariffsService);
    create(dto: CreateTariffDto): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findAll(universityId?: string): Promise<({
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    })[]>;
    findOne(id: string): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    update(id: string, dto: UpdateTariffDto): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
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
