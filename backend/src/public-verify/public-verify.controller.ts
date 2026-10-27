import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PublicVerifyService } from './public-verify.service';

@Controller('public/verify')
export class PublicVerifyController {
    constructor(private readonly verifyService: PublicVerifyService) { }

    /**
     * GET /api/v1/public/verify/:identifier
     * Point d'entrée principal pour la numérisation des QR Codes et recherche par code
     */
    @Get(':identifier')
    @HttpCode(HttpStatus.OK)
    async verifyByIdentifier(@Param('identifier') identifier: string) {
        return this.verifyService.verifyByIdentifier(identifier);
    }

    /**
     * GET /api/v1/public/verify/hash/:hash
     * Point d'entrée pour valider un fichier en comparant son hash SHA-256
     */
    @Get('hash/:hash')
    @HttpCode(HttpStatus.OK)
    async verifyByHash(@Param('hash') hash: string) {
        return this.verifyService.verifyByHash(hash);
    }
}