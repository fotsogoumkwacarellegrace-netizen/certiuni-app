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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    userSelect = {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        universityId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        university: {
            select: {
                id: true,
                name: true,
                code: true,
            },
        },
    };
    async create(dto) {
        const emailNormalized = dto.email.toLowerCase().trim();
        const existingUser = await this.prisma.user.findUnique({
            where: { email: emailNormalized },
        });
        if (existingUser) {
            throw new common_1.ConflictException(`Un utilisateur avec l'email "${dto.email}" existe déjà.`);
        }
        if (dto.universityId) {
            const universityExists = await this.prisma.university.findUnique({
                where: { id: dto.universityId },
            });
            if (!universityExists) {
                throw new common_1.NotFoundException(`Université introuvable avec l'ID spécifié.`);
            }
        }
        const hashedPassword = await argon2.hash(dto.password);
        return this.prisma.user.create({
            data: {
                email: emailNormalized,
                passwordHash: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: dto.role,
                universityId: dto.universityId || null,
            },
            select: this.userSelect,
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: this.userSelect,
        });
    }
    async findAll(universityId) {
        return this.prisma.user.findMany({
            where: universityId ? { universityId } : {},
            select: this.userSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: this.userSelect,
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID #${id} introuvable.`);
        }
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updateData = { ...dto };
        if (dto.email) {
            updateData.email = dto.email.toLowerCase().trim();
        }
        if (dto.password) {
            updateData.passwordHash = await argon2.hash(dto.password);
            delete updateData.password;
        }
        if (dto.universityId) {
            const universityExists = await this.prisma.university.findUnique({
                where: { id: dto.universityId },
            });
            if (!universityExists) {
                throw new common_1.NotFoundException(`Université introuvable avec l'ID spécifié.`);
            }
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: this.userSelect,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map