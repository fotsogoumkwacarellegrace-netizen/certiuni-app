import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerificationService, VerificationResult } from './verification.service';
import { VerifyHashDto } from './dto/verify-hash.dto';
import { VerifyQrDto } from './dto/verify-qr.dto';

@ApiTags('Public Verification')
@Controller('verification')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) { }

    @Post('hash')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vérifier l authenticité d un document via son hash SHA-256 (Accès Public)',
    })
    @ApiResponse({ status: 200, description: 'Document vérifié (Authentique ou Révoqué).' })
    @ApiResponse({ status: 404, description: 'Aucun document trouvé pour ce hash.' })
    verifyHash(@Body() dto: VerifyHashDto): Promise<VerificationResult> {
        return this.verificationService.verifyHash(dto);
    }

    @Post('qr')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vérifier l authenticité d un document via scan QR / Numéro de certificat (Accès Public)',
    })
    @ApiResponse({ status: 200, description: 'Document vérifié (Authentique ou Révoqué).' })
    @ApiResponse({ status: 404, description: 'Numéro de certificat introuvable.' })
    verifyQr(@Body() dto: VerifyQrDto): Promise<VerificationResult> {
        return this.verificationService.verifyQr(dto);
    }
}