import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VerifyService, VerificationResult } from './verify.service';
import { VerifyHashParamDto, VerifyQrDto } from './dto/verify-hash.dto';

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
    async verifyByHash(@Param() params: VerifyHashParamDto): Promise<VerificationResult> {
        return this.verifyService.verifyByHash(params.hash);
    }

    @Post('qr')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vérifier un document à partir du contenu scanné d\'un QR Code (Accès Public)',
    })
    @ApiResponse({ status: 200, description: 'Résultat de la vérification extrait du QR code.' })
    @ApiResponse({ status: 404, description: 'Document non trouvé ou QR code invalide.' })
    async verifyByQr(@Body() dto: VerifyQrDto): Promise<VerificationResult> {
        return this.verifyService.verifyByQrData(dto.qrData);
    }
}