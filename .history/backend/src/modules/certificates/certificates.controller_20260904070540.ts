// src/certificates/certificates.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';
import { CertificatesService } from './certificates.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) { }

  @Get('verify/:publicIdentifier')
  @ApiOperation({ summary: 'Vérification publique d un diplôme (Accès libre)' })
  async verifyPublic(@Param('publicIdentifier') publicIdentifier: string) {
    return this.certificatesService.verifyCertificatePublic(publicIdentifier);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN, UserRole.ISSUER)
  @ApiOperation({ summary: 'Émettre un nouveau diplôme certifié' })
  async issue(@Body() dto: IssueCertificateDto, @Request() req: any) {
    return this.certificatesService.issueCertificate(dto, req.user);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN, UserRole.ISSUER, UserRole.VERIFIER)
  @ApiOperation({ summary: 'Lister les diplômes émis' })
  async findAll(@Request() req: any) {
    return this.certificatesService.findAll(req.user);
  }

  @Patch(':id/revoke')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Révoquer un diplôme' })
  async revoke(
    @Param('id') id: string,
    @Body() dto: RevokeCertificateDto,
    @Request() req: any,
  ) {
    return this.certificatesService.revokeCertificate(id, dto, req.user);
  }
}