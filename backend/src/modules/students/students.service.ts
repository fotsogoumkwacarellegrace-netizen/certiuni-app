import {
    ConflictException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class StudentsService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly studentSelect = {
        id: true,
        matricule: true,
        birthDate: true,
        birthPlace: true,
        nationality: true,
        gender: true,
        idCardNumber: true,
        universityId: true,
        createdAt: true,
        updatedAt: true,
        user: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
                universityId: true,
                university: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        },
        enrollments: {
            select: {
                id: true,
                status: true,
                program: { select: { name: true, code: true } },
                academicLevel: { select: { code: true } },
                academicYear: { select: { year: true } },
            },
        },
    };

    async create(dto: CreateStudentDto) {
        const matriculeClean = dto.matricule.trim().toUpperCase();

        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable avec l'ID #${dto.userId}.`);
        }

        const existingStudentProfile = await this.prisma.student.findUnique({
            where: { userId: dto.userId },
        });

        if (existingStudentProfile) {
            throw new ConflictException('Cet utilisateur possède déjà un profil étudiant.');
        }

        const existingMatricule = await this.prisma.student.findFirst({
            where: { matricule: matriculeClean },
        });

        if (existingMatricule) {
            throw new ConflictException(`Le matricule "${matriculeClean}" est déjà attribué.`);
        }

        return this.prisma.student.create({
            data: {
                userId: dto.userId,
                matricule: matriculeClean,
                firstName: '',
                lastName: '',
                universityId: dto.universityId,
                birthDate: new Date(dto.birthDate),
                birthPlace: dto.birthPlace.trim(),
                nationality: dto.nationality.trim(),
                gender: dto.gender,
                idCardNumber: dto.idCardNumber ? dto.idCardNumber.trim() : null,
            },
            select: this.studentSelect,
        });
    }

    async findAll(currentUser: any) {
        const where: any =
            currentUser?.role === UserRole.SUPER_ADMIN
                ? {}
                : { universityId: currentUser?.universityId };

        return this.prisma.student.findMany({
            where,
            select: this.studentSelect,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, currentUser: any) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            select: this.studentSelect,
        });

        if (!student) {
            throw new NotFoundException(`Profil étudiant introuvable avec l'ID #${id}.`);
        }

        // Isolation multi-locataire : un UNIV_ADMIN ne voit que les étudiants de son université
        if (
            currentUser?.role !== UserRole.SUPER_ADMIN &&
            student.universityId !== currentUser?.universityId
        ) {
            throw new ForbiddenException('Accès non autorisé à cet étudiant.');
        }

        return student;
    }

    async findByMatricule(matricule: string, universityId: string) {
        const student = await this.prisma.student.findUnique({
            where: {
                matricule_universityId: {
                    matricule: matricule.trim().toUpperCase(),
                    universityId: universityId,
                },
            },
            select: this.studentSelect,
        });

        if (!student) {
            throw new NotFoundException(`Étudiant introuvable avec le matricule "${matricule}".`);
        }

        return student;
    }

    async findByUserId(userId: string) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
            select: this.studentSelect,
        });

        if (!student) {
            throw new NotFoundException(`Aucun profil étudiant associé à l'utilisateur #${userId}.`);
        }

        return student;
    }

    async update(id: string, dto: UpdateStudentDto, currentUser: any) {
        const studentToUpdate = await this.findOne(id, currentUser);

        const updateData: any = { ...dto };

        if (dto.matricule) {
            updateData.matricule = dto.matricule.trim().toUpperCase();
            const existing = await this.prisma.student.findUnique({
                where: {
                    matricule_universityId: {
                        matricule: updateData.matricule,
                        universityId: studentToUpdate.universityId,
                    },
                },
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`Le matricule "${updateData.matricule}" appartient à un autre étudiant.`);
            }
        }

        if (dto.birthDate) {
            updateData.birthDate = new Date(dto.birthDate);
        }

        return this.prisma.student.update({
            where: { id },
            data: updateData,
            select: this.studentSelect,
        });
    }

    async remove(id: string, currentUser: any) {
        await this.findOne(id, currentUser);

        return this.prisma.student.delete({
            where: { id },
            select: {
                id: true,
                matricule: true,
            },
        });
    }
}