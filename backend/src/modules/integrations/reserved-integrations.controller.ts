import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Reserved integrations')
@Controller('integrations')
export class ReservedIntegrationsController {
    @Public()
    @Post('auth/google')
    @ApiOperation({ summary: 'Google OAuth reserved integration' })
    googleOAuth(): never {
        return this.notConfigured('google-oauth');
    }

    @Public()
    @Post('auth/apple')
    @ApiOperation({ summary: 'Apple Sign-In reserved integration' })
    appleSignIn(): never {
        return this.notConfigured('apple-sign-in');
    }

    @Public()
    @Post('auth/webauthn/register')
    @ApiOperation({ summary: 'WebAuthn registration reserved integration' })
    webauthnRegister(): never {
        return this.notConfigured('webauthn');
    }

    @Public()
    @Post('auth/webauthn/authenticate')
    @ApiOperation({ summary: 'WebAuthn authentication reserved integration' })
    webauthnAuthenticate(): never {
        return this.notConfigured('webauthn');
    }

    @Post('certificates/specimen')
    @ApiOperation({ summary: 'Specimen mode reserved integration' })
    specimenMode(): never {
        return this.notConfigured('specimen-mode');
    }

    private notConfigured(feature: string): never {
        throw new HttpException(
            { error: 'not_configured', feature },
            HttpStatus.NOT_IMPLEMENTED,
        );
    }
}
