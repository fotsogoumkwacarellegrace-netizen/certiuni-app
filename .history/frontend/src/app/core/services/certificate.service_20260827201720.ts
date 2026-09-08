import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class CertificateService {
  private readonly baseUrl: string;

  constructor(private readonly prisma: PrismaService) {
    // URL de base du portail public de vérification
    this.baseUrl = process.env.PUBLIC_VERIFY_URL || 'https://certiuni.app/verify';
  }

  /**
   * Émet un nouveau diplôme, calcule son hash SHA-256 canonique et génère son QR Code
   */
  async issueCertificate(dto: CreateCertificateDto, createdById: string) {
    // 1. Vérifier que l'université existe
    const university = await this.prisma.university.findUnique({
      where: { id: dto.universityId },
    });

    if (!university) {
      throw new NotFoundException(`Établissement introuvable avec l'ID : ${dto.universityId}`);
    }

    // 2. Générer un identifiant public unique et lisible (Ex: CERT-2026-A8F9K2)
    const publicIdentifier = this.generatePublicIdentifier(university.code);

    // 3. Calcul du Hash Canonique SHA-256
    const canonicalString = this.buildCanonicalString({
      publicIdentifier,
      studentFirstName: dto.studentFirstName,
      studentLastName: dto.studentLastName,
      degreeTitle: dto.degreeTitle,
      fieldOfStudy: dto.fieldOfStudy,
      issueDate: dto.issueDate,
      universityCode: university.code,
    });

    const sha256Hash = crypto.createHash('sha256').update(canonicalString).digest('hex');

    // 4. Construction de l'URL de vérification et génération du QR Code
    const verificationUrl = `${this.baseUrl}/${publicIdentifier}`;
    const qrCodeDataUrl = await this.generateQrCode(verificationUrl);

    try {
      // 5. Sauvegarde en Base de Données
      const certificate = await this.prisma.certificate.create({
        data: {
          publicIdentifier,
          studentFirstName: dto.studentFirstName.trim(),
          studentLastName: dto.studentLastName.trim(),
          degreeTitle: dto.degreeTitle.trim(),
          fieldOfStudy: dto.fieldOfStudy.trim(),
          grade: dto.grade.trim(),
          issueDate: new Date(dto.issueDate),
          canonicalHash: sha256Hash,
          qrCodeDataUrl: qrCodeDataUrl,
          status: 'ISSUED',
          universityId: dto.universityId,
          createdById: createdById,
          metadataJson: dto.metadataJson ? JSON.parse(dto.metadataJson) : null,
        },
        include: {
          university: {
            select: {
              name: true,
              code: true,
              logoUrl: true,
            },
          },
        },
      });

      return {
        message: 'Diplôme émis et certifié avec succès',
        certificate: {
          id: certificate.id,
          publicIdentifier: certificate.publicIdentifier,
          canonicalHash: certificate.canonicalHash,
          verificationUrl,
          qrCodeDataUrl: certificate.qrCodeDataUrl,
          studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
          degreeTitle: certificate.degreeTitle,
          universityName: certificate.university.name,
          issuedAt: certificate.issueDate,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un diplôme avec cet identifiant ou cet empreinte existe déjà.');
      }
      throw new InternalServerErrorException("Erreur lors de la création du diplôme dans la base de données.");
    }
  }

  /**
   * Construit la chaîne canonique normalisée (Déterministe)
   * L'ordre et la casse des éléments sont rigoureusement fixés
   */
  private buildCanonicalString(params: {
    publicIdentifier: string;
    studentFirstName: string;
    studentLastName: string;
    degreeTitle: string;
    fieldOfStudy: string;
    issueDate: string;
    universityCode: string;
  }): string {
    const clean = (str: string) => str.trim().toUpperCase();

    // Format canonique strict : ID|NOM|PRENOM|DIPLOME|DOMAINE|UNIVERSITE|DATE
    return [
      clean(params.publicIdentifier),
      clean(params.studentLastName),
      clean(params.studentFirstName),
      clean(params.degreeTitle),
      clean(params.fieldOfStudy),
      clean(params.universityCode),
      clean(params.issueDate),
    ].join('|');
  }

  /**
   * Génère l'image du QR Code au format Data URL PNG
   */
  private async generateQrCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H', // Correction d'erreur haute
        type: 'image/png',
        margin: 2,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (err) {
      throw new InternalServerErrorException('Échec de la génération du QR Code');
    }
  }

  /**
   * Génère un code public court (Ex: UNIA-2026-X8B9)
   */
  private generatePublicIdentifier(universityCode: string): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
  }
}
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import {
//   VerifyCertificateResponse,
//   GetWalletResponse,
//   PaymentInitResponse,
//   PaymentStatusResponse,
//   MagicLinkResponse,
//   BatchImportResponse,
//   CyberRadarResponse,
// } from '../models/certificate.model';

// /**
//  * Service officiel d'accès à l'API CertiUni.
//  *
//  * Ce service écrit toujours comme s'il appelait la **vraie API REST**
//  * (`environment.apiUrl`). En local, l'intercepteur `MockApiInterceptor`
//  * (activé via `useMock`) court-circuite ces appels et renvoie les mocks.
//  * Aucun changement à faire dans le code des composants pour passer du
//  * mode simulation au mode production : il suffit de basculer `useMock`.
//  */
// @Injectable({ providedIn: 'root' })
// export class CertificateService {
//   private readonly baseUrl = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   /** Vérifie un diplôme via son hash SHA-256. */
//   verifyCertificate(hash: string): Observable<VerifyCertificateResponse> {
//     return this.http.get<VerifyCertificateResponse>(
//       `${this.baseUrl}/certificates/verify/${hash}`
//     );
//   }

//   /** Récupère le portefeuille académique de l'étudiant connecté. */
//   getWallet(): Observable<GetWalletResponse> {
//     return this.http.get<GetWalletResponse>(`${this.baseUrl}/student/wallet`);
//   }

//   /** Initialise un paiement Mobile Money. */
//   initiatePayment(certificateHash: string, phoneNumber: string, paymentMethod: string): Observable<PaymentInitResponse> {
//     return this.http.post<PaymentInitResponse>(`${this.baseUrl}/payments/initiate`, {
//       certificateHash,
//       phoneNumber,
//       paymentMethod,
//     });
//   }

//   /** Vérifie le statut d'une transaction de paiement. */
//   getPaymentStatus(transactionId: string): Observable<PaymentStatusResponse> {
//     return this.http.get<PaymentStatusResponse>(
//       `${this.baseUrl}/payments/status/${transactionId}`
//     );
//   }

//   /** Demande un lien de connexion magique (magic link). */
//   requestMagicLink(identifier: string): Observable<MagicLinkResponse> {
//     return this.http.post<MagicLinkResponse>(`${this.baseUrl}/auth/magic-link`, {
//       identifier,
//     });
//   }

//   /** Importe un lot de diplômes (admin / MINESUP). */
//   batchImport(file: File): Observable<BatchImportResponse> {
//     const form = new FormData();
//     form.append('file', file, file.name);
//     return this.http.post<BatchImportResponse>(
//       `${this.baseUrl}/admin/certificates/batch-import`,
//       form
//     );
//   }

//   /** Récupère les journaux du radar cyber ouest du réseau. */
//   getCyberRadarLogs(): Observable<CyberRadarResponse> {
//     return this.http.get<CyberRadarResponse>(`${this.baseUrl}/admin/cyber-radar/logs`);
//   }
// }
