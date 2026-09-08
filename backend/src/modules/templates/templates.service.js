"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TemplatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const Handlebars = __importStar(require("handlebars"));
let TemplatesService = TemplatesService_1 = class TemplatesService {
    prisma;
    logger = new common_1.Logger(TemplatesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, user) {
        const targetUniversityId = user.role === client_1.UserRole.SUPER_ADMIN ? dto.universityId : user.universityId;
        if (!targetUniversityId) {
            throw new common_1.ForbiddenException("L'ID de l'université est requis pour créer un modèle.");
        }
        const universityExists = await this.prisma.university.findUnique({
            where: { id: targetUniversityId },
        });
        if (!universityExists) {
            throw new common_1.NotFoundException('Université introuvable.');
        }
        if (typeof dto.layoutConfig === 'string') {
            this.validateHandlebarsSyntax(dto.layoutConfig);
        }
        else if (dto.layoutConfig?.htmlContent) {
            this.validateHandlebarsSyntax(dto.layoutConfig.htmlContent);
        }
        return this.prisma.certificateTemplate.create({
            data: {
                name: dto.name,
                description: dto.description,
                layoutConfig: dto.layoutConfig,
                universityId: targetUniversityId,
            },
            include: {
                university: {
                    select: { id: true, name: true, code: true },
                },
            },
        });
    }
    async findAll(user) {
        const whereCondition = user.role === client_1.UserRole.SUPER_ADMIN
            ? {}
            : { universityId: user.universityId };
        return this.prisma.certificateTemplate.findMany({
            where: whereCondition,
            include: {
                university: {
                    select: { id: true, name: true, code: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, user) {
        const template = await this.prisma.certificateTemplate.findUnique({
            where: { id },
            include: {
                university: {
                    select: { id: true, name: true, code: true },
                },
            },
        });
        if (!template) {
            throw new common_1.NotFoundException(`Modèle introuvable avec l'ID "${id}".`);
        }
        if (user.role !== client_1.UserRole.SUPER_ADMIN && template.universityId !== user.universityId) {
            throw new common_1.ForbiddenException("Accès non autorisé à ce modèle de diplôme.");
        }
        return template;
    }
    async update(id, dto, user) {
        await this.findOne(id, user);
        if (typeof dto.layoutConfig === 'string') {
            this.validateHandlebarsSyntax(dto.layoutConfig);
        }
        else if (dto.layoutConfig?.htmlContent) {
            this.validateHandlebarsSyntax(dto.layoutConfig.htmlContent);
        }
        return this.prisma.certificateTemplate.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.layoutConfig && { layoutConfig: dto.layoutConfig }),
            },
            include: {
                university: {
                    select: { id: true, name: true, code: true },
                },
            },
        });
    }
    async remove(id, user) {
        await this.findOne(id, user);
        return this.prisma.certificateTemplate.delete({
            where: { id },
        });
    }
    validateHandlebarsSyntax(templateContent) {
        try {
            Handlebars.compile(templateContent);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Syntaxe Handlebars invalide dans le modèle fourni : ${error.message}`);
        }
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = TemplatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map