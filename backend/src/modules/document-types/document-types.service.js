"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DocumentTypesService = class DocumentTypesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    documentTypeSelect = {
        id: true,
        code: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
            select: {
                certificates: true,
            },
        },
    };
    async create(dto) {
        const codeClean = dto.code.trim().toUpperCase();
        const existingType = await this.prisma.documentType.findUnique({
            where: { code: codeClean },
        });
        if (existingType) {
            throw new common_1.ConflictException(`Un type de document avec le code "${codeClean}" existe déjà.`);
        }
        return this.prisma.documentType.create({
            data: {
                code: codeClean,
                name: dto.name.trim(),
                description: dto.description ? dto.description.trim() : null,
            },
            select: this.documentTypeSelect,
        });
    }
    async findAll() {
        return this.prisma.documentType.findMany({
            select: this.documentTypeSelect,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const documentType = await this.prisma.documentType.findUnique({
            where: { id },
            select: this.documentTypeSelect,
        });
        if (!documentType) {
            throw new common_1.NotFoundException(`Type de document introuvable avec l'ID #${id}.`);
        }
        return documentType;
    }
    async findByCode(code) {
        const codeClean = code.trim().toUpperCase();
        const documentType = await this.prisma.documentType.findUnique({
            where: { code: codeClean },
            select: this.documentTypeSelect,
        });
        if (!documentType) {
            throw new common_1.NotFoundException(`Type de document introuvable avec le code "${codeClean}".`);
        }
        return documentType;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updateData = { ...dto };
        if (dto.code) {
            updateData.code = dto.code.trim().toUpperCase();
            const existing = await this.prisma.documentType.findUnique({
                where: { code: updateData.code },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Le code "${updateData.code}" est déjà utilisé par un autre type de document.`);
            }
        }
        if (dto.name) {
            updateData.name = dto.name.trim();
        }
        if (dto.description !== undefined) {
            updateData.description = dto.description ? dto.description.trim() : null;
        }
        return this.prisma.documentType.update({
            where: { id },
            data: updateData,
            select: this.documentTypeSelect,
        });
    }
    async remove(id) {
        const documentType = await this.findOne(id);
        if (documentType._count.certificates > 0) {
            throw new common_1.ConflictException(`Impossible de supprimer ce type de document car ${documentType._count.certificates} document(s) y sont rattaché(s).`);
        }
        return this.prisma.documentType.delete({
            where: { id },
            select: {
                id: true,
                code: true,
                name: true,
            },
        });
    }
};
exports.DocumentTypesService = DocumentTypesService;
exports.DocumentTypesService = DocumentTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentTypesService);
//# sourceMappingURL=document-types.service.js.map