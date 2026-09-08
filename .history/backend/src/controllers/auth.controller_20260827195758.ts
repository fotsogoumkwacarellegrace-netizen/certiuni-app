import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de connexion publique
   * POST /api/v1/auth/login
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint protégé pour récupérer le profil connecté
   * GET /api/v1/auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    // req.user est automatiquement injecté par le JwtStrategy
    return req.user;
  }
}