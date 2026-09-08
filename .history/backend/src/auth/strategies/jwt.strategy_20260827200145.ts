import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    universityId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super_secret_certiuni_key_2026',
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.authService.validateUserById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user; // Injecté dans req.user
    }
}