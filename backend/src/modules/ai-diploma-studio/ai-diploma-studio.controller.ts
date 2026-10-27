import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AIDiplomaStudioService } from './ai-diploma-studio.service';

@Controller('ai-diploma')
export class AIDiplomaStudioController {
  constructor(private readonly aiService: AIDiplomaStudioService) {}

  /** IA-01: Créer ou adapter un modèle visuel */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Post('model')
  async createModel(
    @Body() body: { establishmentId: string; elements: any },
    @GetUser('id') adminId: string,
  ) {
    return this.aiService.createVisualModel(
      body.establishmentId,
      body.elements,
      adminId,
    );
  }

  /** IA-02: Prévisualiser le modèle */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Post('model/:modelId/preview')
  async previewModel(
    @Param('modelId') modelId: string,
    @GetUser('id') adminId: string,
  ) {
    return this.aiService.previewModel(modelId, adminId);
  }

  /** IA-03: Gérer versions/validations/approvals */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Post('model/:modelId/manage')
  async manageVersion(
    @Param('modelId') modelId: string,
    @Body() body: { action: 'CREATE_VERSION' | 'APPROVE' | 'REJECT'; data?: any },
    @GetUser('id') adminId: string,
  ) {
    return this.aiService.manageModelVersions(
      modelId,
      body.action,
      adminId,
      body.data,
    );
  }

  /** IA-04: Valider design du modèle */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Post('model/:modelId/validate-design')
  async validateDesign(
    @Param('modelId') modelId: string,
    @Body() body: { legibility: 'GOOD' | 'FAIR' | 'POOR'; fonts: string[]; logos: string[]; layout: 'STANDARD' | 'CUSTOM' },
    @GetUser('id') adminId: string,
  ) {
    return this.aiService.validateModelDesign(modelId, body, adminId);
  }

  /** IA-05: Requérir validation humaine */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Post('model/:modelId/human-validation')
  async humanValidation(
    @Param('modelId') modelId: string,
    @GetUser('id') adminId: string,
  ) {
    return this.aiService.requireHumanValidation(modelId, adminId);
  }

  /** IA-06: Vérifier avertissement authenticité IA */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Post('model/:modelId/warning')
  async checkWarning(
    @Param('modelId') modelId: string,
  ) {
    return this.aiService.checkIAAuthenticityWarning(modelId);
  }
}