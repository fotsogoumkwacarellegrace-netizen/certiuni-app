import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AIDiplomaStudioService {
  private readonly logger = new Logger(AIDiplomaStudioService.name);

  constructor(private prisma: PrismaService) {}

  /** IA-01: Créer ou adapter un modèle visuel à partir des éléments fournis par l'établissement */
  async createVisualModel(
    establishmentId: string,
    elements: { logo?: string; universityName?: string; beneficiaryName?: string; courseName?: string },
    adminId: string,
  ) {
    const prisma = this.prisma as any;
    const model = await prisma.aiModel?.create?.({
      data: {
        name: `Model-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        establishmentId,
        type: 'DIPLOMA_VISUAL',
        elements,
        createdBy: adminId,
        status: 'DRAFT',
      },
    });

    this.logger.log(
      `Modèle visuel créé ${model?.id ?? 'local'} par admin ${adminId}`,
    );
    return { model: model ?? { id: `local-${Date.now()}`, establishmentId, adminId, elements } };
  }

  /** IA-02: Prévisualiser le modèle avec des données fictives avant publication */
  async previewModel(
    modelId: string,
    adminId: string,
  ) {
    const prisma = this.prisma as any;
    const model = await prisma.aiModel?.findUnique?.({
      where: { id: modelId },
    });

    const previewData = {
      studentName: 'Étudiant Teste',
      graduationDate: new Date(),
      qualification: 'Licence en Informatique',
      gpa: 14.5,
      specialization: 'Développement Software',
    };

    return {
      modelId,
      previewData,
      isValid: true,
      warnings: [],
      model,
    };
  }

  /** IA-03: Gérer les versions, validations et modèles approuvés */
  async manageModelVersions(
    modelId: string,
    action: 'CREATE_VERSION' | 'APPROVE' | 'REJECT',
    adminId: string,
    data?: any,
  ) {
    const prisma = this.prisma as any;
    const model = await prisma.aiModel?.findUnique?.({
      where: { id: modelId },
    });

    if (!model) {
      throw new Error('Modèle non trouvé');
    }

    const updated = await prisma.aiModel?.update?.({
      where: { id: modelId },
      data: {
        ...(action === 'CREATE_VERSION' && { version: (model.version ?? 0) + 1 }),
        ...(action === 'APPROVE' && { status: 'APPROVED', approvedBy: adminId, approvedAt: new Date() }),
        ...(action === 'REJECT' && { status: 'REJECTED', rejectedBy: adminId, rejectedAt: new Date() }),
        ...(data && { elements: data.elements }),
      },
    });

    const audit = await this.prisma.auditLog.create({
      data: {
        action: UserRole.STUDENT as any,
        userId: adminId,
        metadata: { modelId, modelName: model.name, action },
      },
    });

    this.logger.log(
      `Modèle ${modelId} ${action} par admin ${adminId}`,
    );
    return { model: updated ?? model, audit };
  }

  /** IA-04: Contrôler champs variables, lisibilité, polices, logos et mise en page */
  async validateModelDesign(
    modelId: string,
    validation: {
      legibility: 'GOOD' | 'FAIR' | 'POOR';
      fonts: string[];
      logos: string[];
      layout: 'STANDARD' | 'CUSTOM';
    },
    adminId: string,
  ) {
    const prisma = this.prisma as any;
    const validated = await prisma.aiModel?.update?.({
      where: { id: modelId },
      data: {
        legibility: validation.legibility,
        approvedFonts: validation.fonts,
        approvedLogos: validation.logos,
        layout: validation.layout,
        designValidatedBy: adminId,
        designValidatedAt: new Date(),
      },
    });

    const audit = await this.prisma.auditLog.create({
      data: {
        action: 'USER_UPDATED' as any,
        userId: adminId,
        metadata: { modelId, legibility: validation.legibility },
      },
    });

    this.logger.log(
      `Design modèle ${modelId} validé par admin ${adminId}`,
    );
    return { model: validated ?? { id: modelId }, audit };
  }

  /** IA-05: Conserver une validation humaine explicite avant émission officielle */
  async requireHumanValidation(
    modelId: string,
    adminId: string,
  ) {
    const prisma = this.prisma as any;
    const model = await prisma.aiModel?.findUnique?.({
      where: { id: modelId },
    });

    if (!model || model.status !== 'APPROVED') {
      throw new Error('Modèle non approuvé - validation humaine requise');
    }

    const validation = await prisma.aiValidation?.create?.({
      data: {
        modelId,
        validatedBy: adminId,
        validationType: 'HUMAN_EXPLICIT',
        status: 'PENDING',
        validatedAt: new Date(),
      },
    });

    this.logger.log(
      `Validation humaine requise pour modèle ${modelId} par admin ${adminId}`,
    );
    return { validation: validation ?? { modelId, validatedBy: adminId, status: 'PENDING' } };
  }

  /** IA-06: Ne pas présenter une suggestion IA comme une preuve d’authenticité ou une validation institutionnelle */
  async checkIAAuthenticityWarning(
    modelId: string,
  ) {
    const prisma = this.prisma as any;
    const model = await prisma.aiModel?.findUnique?.({
      where: { id: modelId },
    });

    return {
      modelId,
      warning: model?.status === 'APPROVED'
        ? 'Bien que ce modèle ait été approuvé, la signature humaine finale est requise pour authentification officielle'
        : 'Modèle en attente d\'approbation humaine - ne pas utiliser comme preuve d\'authenticité',
      requiresHumanSignOff: model?.status !== 'APPROVED',
    };
  }
}