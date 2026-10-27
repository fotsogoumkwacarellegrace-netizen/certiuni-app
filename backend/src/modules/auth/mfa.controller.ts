import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { MfaService } from './mfa.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { MfaEnrollDto, MfaVerifyTokenDto, MfaDisableDto } from './dto/mfa-enroll.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { AuthService } from './auth.service';

@ApiTags('MFA / TOTP')
@Controller('auth/mfa')
export class MfaController {
    constructor(private readonly mfaService: MfaService, private readonly authService: AuthService) { }

    // --- Démarrer l'enrôlement MFA (génère secret + QR code) ---
    @Post('enroll')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Démarrer l\'enrôlement MFA/TOTP' })
    @ApiResponse({ status: 200, description: 'Secret TOTP et URL QR Code générés.' })
    async enroll(@GetUser('id') userId: string, @GetUser('email') email: string) {
        return this.mfaService.enrollStart(userId, email);
    }

    // --- Confirmer l'enrôlement MFA (valide le code TOTP et active le MFA) ---
    @Post('verify-enroll')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Confirmer l\'enrôlement MFA avec le code TOTP' })
    @ApiResponse({ status: 200, description: 'MFA activé avec succès.' })
    async confirmEnroll(@Body() dto: MfaVerifyTokenDto) {
        return this.mfaService.confirmEnroll(dto.userId, dto.code);
    }

    // --- Vérifier un code TOTP (étape 2FA lors de la connexion) ---
    @Post('verify')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Vérifier un code TOTP pour la connexion 2FA' })
    @ApiResponse({ status: 200, description: 'Code TOTP valide.' })
    async verify(@Body() dto: MfaVerifyDto) {
        // Le DTO MfaVerifyDto contient mfaToken (userId) et code
        return this.mfaService.verifyToken(dto.mfaToken, dto.code);
    }

    // --- Désactiver le MFA ---
    @Post('disable')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Désactiver le MFA/TOTP' })
    @ApiResponse({ status: 200, description: 'MFA désactivé.' })
    async disable(@GetUser('id') userId: string) {
        return this.mfaService.disable(userId);
    }

    // --- Statut MFA de l'utilisateur connecté ---
    @Get('status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Vérifier si le MFA est activé pour l\'utilisateur' })
    @ApiResponse({ status: 200, description: 'Statut MFA.' })
    async status(@GetUser('id') userId: string) {
        const enabled = await this.mfaService.isMfaEnabled(userId);
        return { mfaEnabled: enabled };
    }
}
