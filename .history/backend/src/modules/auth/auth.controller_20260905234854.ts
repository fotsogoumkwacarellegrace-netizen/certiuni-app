import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from '../modules/auth/auth.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authentification utilisateur et génération de tokens' })
  @ApiResponse({ status: 200, description: 'Connexion réussie.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l’utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir les jetons d\'accès' })
  @ApiResponse({ status: 200, description: 'Nouveaux jetons générés.' })
  @ApiResponse({ status: 401, description: 'Jeton invalide ou expiré.' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Déconnexion de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  async logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }
}