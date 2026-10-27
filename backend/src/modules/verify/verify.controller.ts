import { Controller, Get, Post, Body, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VerifyService, VerificationResult } from './verify.service';
import { VerifyHashParamDto, VerifyQrDto } from './dto/verify-hash.dto';
import { BulkVerifyDto } from './dto/bulk-verify.dto';

@ApiTags('Public Verification')
@Controller('verify')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) { }

    @Get(':hash')
    @ApiOperation({
        summary: 'Vérifier l\'authenticité d\'un diplôme par son empreinte SHA-256 (Accès Public)',
    })
    @ApiParam({
        name: 'hash',
        description: 'Hash SHA-256 du document (64 caractères hexadécimaux)',
        example: 'a3f8b1c2d3e4f567890abcdef1234567890abcdef1234567890abcdef1234567',
    })
    @ApiResponse({ status: 200, description: 'Résultat de la vérification du document.' })
    @ApiResponse({ status: 404, description: 'Aucun document trouvé pour ce hash.' })
    async verifyByHash(@Param() params: VerifyHashParamDto, @Req() req: any): Promise<VerificationResult> {
        return this.verifyService.verifyByHash(params.hash, {
            ip: req.ip,
            userAgent: req.get('user-agent') || req.headers['user-agent'],
        });
    }

    @Post('qr')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vérifier un document à partir du contenu scanné d\'un QR Code (Accès Public)',
    })
    @ApiResponse({ status: 200, description: 'Résultat de la vérification extrait du QR code.' })
    @ApiResponse({ status: 404, description: 'Document non trouvé ou QR code invalide.' })
    async verifyByQr(@Body() dto: VerifyQrDto, @Req() req: any): Promise<VerificationResult> {
        return this.verifyService.verifyByQrData(dto.qrData, {
            ip: req.ip,
            userAgent: req.get('user-agent') || req.headers['user-agent'],
        });
    }

    @Post('bulk')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vérification de masse de documents à partir d\'un fichier Excel/CSV',
    })
    @ApiResponse({ status: 200, description: 'Tableau de résultats de vérification pour chaque hash du fichier.' })
    async bulkVerify(@Body() dto: BulkVerifyDto): Promise<Array<{ hash: string; status: string; universityName?: string; issuedBy?: string }>> {
        return this.verifyService.bulkVerify(dto.file);
    }
}