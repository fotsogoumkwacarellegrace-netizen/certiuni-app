import {
  BadGatewayException,
  BadRequestException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CertificateStatus, Prisma } from '@prisma/client';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { ExtractedDiplomaSchema, ImageVerificationResult, RequestMeta } from '@modules/diplomas-verification/type/schema';
import { ExtractedDiploma, FieldChecks, FieldResult, VerificationStatus } from '@modules/diplomas-verification/type/diplomas-verification.type';


type SharpInstance = ReturnType<typeof sharp>;


const CERT_NUMBER_REGEX = /CERT-\d{4}-[A-F0-9]{8}/i;

/** Champs qui doivent être lus ET concorder pour conclure à un MATCH. */
const REQUIRED_FIELDS: (keyof ExtractedDiploma)[] = [
  'lastName',
  'firstName',
  'degreeTitle',
];

// Identité : aucune tolérance (deux noms à une lettre d'écart = deux personnes).
const STRICT = { tolerance: 0, minRatio: 1, minTokenLength: 1 };
// Texte descriptif : on tolère 1 faute de lecture et 20 % de mots manquants.
const LENIENT = { tolerance: 1, minRatio: 0.8, minTokenLength: 3 };

const DEFAULT_MODEL = 'qwen/qwen3.8-27b';

const EXTRACTION_PROMPT =
  "Tu extrais des informations d'un diplôme ou certificat universitaire. " +
  'Réponds uniquement en JSON avec exactement ces clés : ' +
  'firstName, lastName, degreeTitle, fieldOfStudy, university, issueDate, certificateNumber. ' +
  "issueDate doit être au format ISO YYYY-MM-DD. certificateNumber est le numéro imprimé sur le document (ex: CERT-2026-1A2B3C4D). " +
  "Mets null pour tout champ absent ou illisible. N'invente jamais de valeur.";

const comparisonSelect = Prisma.validator<Prisma.CertificateSelect>()({
  id: true,
  publicIdentifier: true,
  status: true,
  studentFirstName: true,
  studentLastName: true,
  degreeTitle: true,
  fieldOfStudy: true,
  issueDate: true,
  university: { select: { name: true } },
});

type CertificateForComparison = Prisma.CertificateGetPayload<{
  select: typeof comparisonSelect;
}>;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class DiplomaImageVerificationService {
  private readonly logger = new Logger(DiplomaImageVerificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Workflow :
   * 1. extraire les infos du document (LLM vision) et le QR code (en parallèle)
   * 2. si le QR est lu, retrouver le certificat en BD
   * 3. comparer les données extraites avec la BD
   * 4. renvoyer les données extraites + le verdict (isMatch)
   */
  async verifyFromImage(
    buffer: Buffer,
    meta?: RequestMeta,
  ): Promise<ImageVerificationResult> {
    const { oriented, forLlm } = await this.prepareImage(buffer);

    const [extracted, qrRaw] = await Promise.all([
      this.extractDocumentInfo(forLlm),
      this.extractQrCode(oriented),
    ]);

    if (!qrRaw) {
      return this.buildResult(extracted, false, null, 'QR_NOT_FOUND', null);
    }

    const certificateNumber = this.extractCertificateNumber(qrRaw);
    if (!certificateNumber) {
      return this.buildResult(extracted, true, null, 'QR_INVALID', null);
    }

    const certificate = await this.prisma.certificate.findUnique({
      where: { publicIdentifier: certificateNumber },
      select: comparisonSelect,
    });
    if (!certificate) {
      return this.buildResult(extracted, true, certificateNumber, 'NOT_FOUND', false);
    }

    await this.logVerification(certificate.id, meta);

    const fields = this.compareWithCertificate(extracted, certificate);
    const { status, isMatch } = this.decide(certificate.status, fields);

    return this.buildResult(extracted, true, certificateNumber, status, isMatch, fields);
  }

  // -------------------------------------------------------------------------
  // Étape 0 : préparation de l'image
  // -------------------------------------------------------------------------

  private async prepareImage(
    buffer: Buffer,
  ): Promise<{ oriented: Buffer; forLlm: Buffer }> {
    try {
      // Applique l'orientation EXIF (photos de téléphone) et limite la taille décodée
      const oriented = await sharp(buffer, { limitInputPixels: 50_000_000 })
        .rotate()
        .toBuffer();

      // Version réduite pour le LLM : moins chère et plus rapide à envoyer
      const forLlm = await sharp(oriented)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      return { oriented, forLlm };
    } catch {
      throw new BadRequestException('Image invalide ou illisible.');
    }
  }

  // -------------------------------------------------------------------------
  // Étape 1 : extraction des infos du document (LLM vision via Groq)
  // -------------------------------------------------------------------------

  private async extractDocumentInfo(jpeg: Buffer): Promise<ExtractedDiploma> {
    const apiKey = process.env.GROQ_API_KEY;
    // Modèle réglable dans le .env sans toucher au code
    const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;
    if (!apiKey) {
      throw new InternalServerErrorException('Extraction IA non configurée.');
    }

    // Lu ici (et non en haut du fichier) pour que le .env soit déjà chargé
    const timeoutMs = Number(process.env.GROQ_TIMEOUT_MS) || 60_000;
    // Qwen3.8 réfléchit par défaut ; "none" coupe la réflexion : inutile pour lire un document, et plus lent
    const reasoningEffort = process.env.GROQ_REASONING_EFFORT ?? 'none';

    const dataUrl = `data:image/jpeg;base64,${jpeg.toString('base64')}`;

    let json: any;
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          reasoning_effort: reasoningEffort,
          messages: [
            { role: 'system', content: EXTRACTION_PROMPT },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extrais les informations de ce diplôme.' },
                { type: 'image_url', image_url: { url: dataUrl } },
              ],
            },
          ],
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!res.ok) {
        // Le corps d'une erreur Groq ne contient pas l'image : on peut en logger le début
        const detail = (await res.text()).slice(0, 300);
        this.logger.error(`Groq a répondu ${res.status} : ${detail}`);
        throw new BadGatewayException("Service d'extraction indisponible.");
      }

      // Le délai court aussi pendant la lecture du corps : elle doit rester dans le try
      json = await res.json();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if ((error as Error).name === 'TimeoutError') {
        this.logger.error(`Groq : délai de ${timeoutMs / 1000} s dépassé`);
        throw new GatewayTimeoutException(
          "Le service d'extraction a mis trop de temps à répondre.",
        );
      }
      this.logger.error(`Appel Groq échoué : ${(error as Error).message}`);
      throw new BadGatewayException("Service d'extraction indisponible.");
    }

    const content: string | undefined = json?.choices?.[0]?.message?.content;
    if (!content) {
      throw new BadGatewayException("Réponse vide du service d'extraction.");
    }

    try {
      // Certains modèles entourent le JSON de balises ```json
      const cleaned = content.replace(/```json|```/g, '').trim();
      return ExtractedDiplomaSchema.parse(JSON.parse(cleaned));
    } catch {
      throw new BadGatewayException("Réponse du service d'extraction invalide.");
    }
  }

  // -------------------------------------------------------------------------
  // Étape 2 : extraction du QR code
  // -------------------------------------------------------------------------

  /** Retourne le texte brut du QR, ou null. Essaie plusieurs prétraitements. */
  private async extractQrCode(image: Buffer): Promise<string | null> {
    const variants: ((s: SharpInstance) => SharpInstance)[] = [
      (s) => s,
      (s) => s.grayscale().normalize(),
      (s) => s.grayscale().normalize().sharpen(),
      (s) => s.grayscale().threshold(128),
    ];

    for (const variant of variants) {
      try {
        const base = sharp(image).resize({
          width: 2400,
          height: 2400,
          fit: 'inside',
          withoutEnlargement: true,
        });
        const { data, info } = await variant(base)
          .toColourspace('srgb')
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        if (info.channels !== 4) continue; // jsQR exige du RGBA

        const code = jsQR(new Uint8ClampedArray(data), info.width, info.height, {
          inversionAttempts: 'attemptBoth',
        });
        if (code?.data) return code.data;
      } catch {
        // on passe à la variante suivante
      }
    }
    return null;
  }

  /** Extrait CERT-YYYY-XXXXXXXX d'une URL complète ou d'un numéro seul. */
  private extractCertificateNumber(raw: string): string | null {
    return raw.match(CERT_NUMBER_REGEX)?.[0].toUpperCase() ?? null;
  }

  // -------------------------------------------------------------------------
  // Étape 3 : comparaison avec la BD
  // -------------------------------------------------------------------------

  private compareWithCertificate(
    extracted: ExtractedDiploma,
    cert: CertificateForComparison,
  ): FieldChecks {
    const fields: FieldChecks = {};
    const set = (key: keyof ExtractedDiploma, result: FieldResult | null) => {
      if (result) fields[key] = result; // null = rien à comparer en BD
    };

    set('lastName', this.compareText(extracted.lastName, cert.studentLastName, STRICT));
    set('firstName', this.compareText(extracted.firstName, cert.studentFirstName, STRICT));
    set('degreeTitle', this.compareText(extracted.degreeTitle, cert.degreeTitle, LENIENT));
    set('fieldOfStudy', this.compareText(extracted.fieldOfStudy, cert.fieldOfStudy, LENIENT));
    set('university', this.compareText(extracted.university, cert.university?.name, LENIENT));
    set('issueDate', this.compareDate(extracted.issueDate, cert.issueDate));
    set(
      'certificateNumber',
      this.compareCertificateNumber(extracted.certificateNumber, cert.publicIdentifier),
    );

    return fields;
  }

  private decide(
    certStatus: CertificateStatus,
    fields: FieldChecks,
  ): { status: VerificationStatus; isMatch: boolean | null } {
    if (certStatus === CertificateStatus.REVOKED) {
      return { status: 'REVOKED', isMatch: false };
    }
    // PENDING / FAILED : le document n'a jamais été émis officiellement
    if (certStatus !== CertificateStatus.ISSUED) {
      return { status: 'NOT_FOUND', isMatch: false };
    }
    if (Object.values(fields).includes('MISMATCH')) {
      return { status: 'MISMATCH', isMatch: false };
    }
    if (REQUIRED_FIELDS.every((f) => fields[f] === 'MATCH')) {
      return { status: 'MATCH', isMatch: true };
    }
    return { status: 'INCONCLUSIVE', isMatch: null };
  }

  // -------------------------------------------------------------------------
  // Helpers de comparaison
  // -------------------------------------------------------------------------

  /**
   * Vérifie que les mots attendus (BD) se retrouvent dans le texte lu.
   * Retourne null quand la BD n'a rien à comparer.
   */
  private compareText(
    read: string | null,
    expected: string | null | undefined,
    opts: { tolerance: number; minRatio: number; minTokenLength: number },
  ): FieldResult | null {
    if (!expected?.trim()) return null;
    if (!read) return 'UNREADABLE';

    const readTokens = this.normalize(read).split(' ').filter(Boolean);
    const expectedTokens = this.normalize(expected)
      .split(' ')
      .filter((t) => t.length >= opts.minTokenLength);
    if (!expectedTokens.length) return null;

    const found = expectedTokens.filter((e) => {
      const allowed = e.length >= 5 ? opts.tolerance : 0;
      return readTokens.some((r) => this.levenshtein(r, e) <= allowed);
    }).length;

    return found / expectedTokens.length >= opts.minRatio ? 'MATCH' : 'MISMATCH';
  }

  /** Tolère 1 jour d'écart (date stockée en UTC, date imprimée en heure locale). */
  private compareDate(read: string | null, expected: Date): FieldResult {
    if (!read || !/^\d{4}-\d{2}-\d{2}$/.test(read)) return 'UNREADABLE';
    const readMs = Date.parse(read); // YYYY-MM-DD est interprété en UTC
    if (Number.isNaN(readMs)) return 'UNREADABLE';

    const expectedMs = Date.UTC(
      expected.getUTCFullYear(),
      expected.getUTCMonth(),
      expected.getUTCDate(),
    );
    return Math.abs(readMs - expectedMs) <= 86_400_000 ? 'MATCH' : 'MISMATCH';
  }

  /** Numéro imprimé sur le document vs numéro du QR : doivent être identiques. */
  private compareCertificateNumber(
    read: string | null,
    expected: string,
  ): FieldResult {
    const number = read ? this.extractCertificateNumber(read) : null;
    if (!number) return 'UNREADABLE';
    return number === expected.toUpperCase() ? 'MATCH' : 'MISMATCH';
  }

  private normalize(s: string): string {
    return s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [
      i,
      ...new Array<number>(b.length).fill(0),
    ]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        );
      }
    }
    return dp[a.length][b.length];
  }

  // -------------------------------------------------------------------------
  // Divers
  // -------------------------------------------------------------------------

  private buildResult(
    extracted: ExtractedDiploma,
    qrFound: boolean,
    certificateNumber: string | null,
    status: VerificationStatus,
    isMatch: boolean | null,
    fields: FieldChecks | null = null,
  ): ImageVerificationResult {
    return {
      extracted,
      qr: { found: qrFound, certificateNumber },
      verification: { status, isMatch, fields },
    };
  }

  /** Trace la vérification ; une erreur de log ne doit jamais bloquer la réponse. */
  private async logVerification(
    certificateId: string,
    meta?: RequestMeta,
  ): Promise<void> {
    try {
      await this.prisma.verificationLog.create({
        data: {
          certificateId,
          ipAddress: meta?.ipAddress?.slice(0, 45),
          userAgent: meta?.userAgent?.slice(0, 512),
        },
      });
    } catch (error) {
      this.logger.warn(`Journal de vérification non écrit : ${(error as Error).message}`);
    }
  }
}
