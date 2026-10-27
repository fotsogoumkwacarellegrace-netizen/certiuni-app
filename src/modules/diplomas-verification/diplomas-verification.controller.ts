import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { DiplomaImageVerificationService } from "./diplomas-verification.service";
import { ImageVerificationResult } from '@modules/diplomas-verification/type/schema';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 Mo
const ALLOWED_MIME = /^image\/(png|jpe?g|webp)$/;

@ApiTags('Vérification')
@Controller('verification')
export class DiplomaVerificationController {
  constructor(
    private readonly diplomaVerification: DiplomaImageVerificationService,
  ) {}

  /**
   * POST /verification/image
   * Body : multipart/form-data, champ "file" (photo du diplôme)
   */
  @Post('image')
  @HttpCode(HttpStatus.OK)
  // Route publique qui déclenche un appel IA payant : on limite à 5 requêtes / minute / IP
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_IMAGE_SIZE, files: 1 } }),
  )
  @ApiOperation({
    summary: "Vérifier un diplôme à partir d'une photo",
    description:
      "Extrait les informations du document et son QR code, puis les compare avec les données enregistrées.",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  verifyImage(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ): Promise<ImageVerificationResult> {
    if (!file) {
      throw new BadRequestException('Le champ "file" (image du diplôme) est obligatoire.');
    }
    if (!ALLOWED_MIME.test(file.mimetype)) {
      throw new BadRequestException('Image PNG, JPEG ou WebP requise.');
    }

    return this.diplomaVerification.verifyFromImage(file.buffer, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
}
