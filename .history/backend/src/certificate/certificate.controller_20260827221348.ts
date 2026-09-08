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