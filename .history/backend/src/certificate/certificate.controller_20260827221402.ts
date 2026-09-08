import { Controller, Patch, Param, Body, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';

@Controller('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificatesController {
    constructor(private readonly certificateService: CertificateService) { }

    /**
     * PATCH /api/v1/certificates/:id/revoke
     * Réserve l'accès aux rôles SUPER_ADMIN et ADMIN_UNIV
     */
    @Patch(':id/revoke')
    @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN_UNIV)
    async revokeCertificate(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: RevokeCertificateDto,
        @Request() req,
    ) {
        return this.certificateService.revokeCertificate(id, dto, req.user);
    }
}
// import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
// import { CertificateService } from './certificate.service';
// import { CreateCertificateDto } from './dto/create-certificate.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @Controller('certificates')
// @UseGuards(JwtAuthGuard)
// export class CertificatesController {
//     constructor(private readonly certificateService: CertificateService) { }

//     /**
//      * POST /api/v1/certificates/issue
//      * Nécessite un jeton JWT valide (Réservé aux administrateurs / agents)
//      */
//     @Post('issue')
//     async issueCertificate(@Body() dto: CreateCertificateDto, @Request() req) {
//         // req.user.id provient du jeton décodé
//         return this.certificateService.issueCertificate(dto, req.user.id);
//     }
// }