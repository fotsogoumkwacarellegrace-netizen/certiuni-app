import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { prisma } from '../server';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Helper: Génère un identifiant public unique (Ex: UY1-2026-A8F9K2)
 */
const generatePublicIdentifier = (universityCode: string): string => {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
};

/**
 * Helper: Construit la chaîne canonique normalisée (Déterministe)
 * Format : ID|NOM|PRENOM|DIPLOME|DOMAINE|UNIVERSITE|DATE
 */
const buildCanonicalString = (params: {
  publicIdentifier: string;
  studentLastName: string;
  studentFirstName: string;
  degreeTitle: string;
  fieldOfStudy: string;
  universityCode: string;
  issueDate: string;
}): string => {
  const clean = (str: string) => str.trim().toUpperCase();

  return [
    clean(params.publicIdentifier),
    clean(params.studentLastName),
    clean(params.studentFirstName),
    clean(params.degreeTitle),
    clean(params.fieldOfStudy),
    clean(params.universityCode),
    clean(params.issueDate),
  ].join('|');
};

/**
 * POST /api/v1/certificates/issue
 * Émet un nouveau diplôme (Protégé par JWT)
 */
router.post('/issue', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      studentFirstName,
      studentLastName,
      degreeTitle,
      fieldOfStudy,
      grade,
      issueDate,
      universityId,
      metadataJson,
    } = req.body;

    // 1. Validation basique des données d'entrée
    if (
      !studentFirstName ||
      !studentLastName ||
      !degreeTitle ||
      !fieldOfStudy ||
      !grade ||
      !issueDate ||
      !universityId
    ) {
      res.status(400).json({
        status: 'fail',
        message: 'Tous les champs obligatoires doivent être renseignés.',
      });
      return;
    }

    // 2. Vérification de l'existence de l'établissement
    const university = await prisma.university.findUnique({
      where: { id: universityId },
    });

    if (!university) {
      res.status(404).json({
        status: 'fail',
        message: `Établissement introuvable avec l'ID : ${universityId}`,
      });
      return;
    }

    // 3. Génération de l'identifiant public unique
    const publicIdentifier = generatePublicIdentifier(university.code);

    // 4. Calcul du Hash SHA-256 Canonique
    const canonicalString = buildCanonicalString({
      publicIdentifier,
      studentLastName,
      studentFirstName,
      degreeTitle,
      fieldOfStudy,
      universityCode: university.code,
      issueDate,
    });

    const canonicalHash = crypto
      .createHash('sha256')
      .update(canonicalString)
      .digest('hex');

    // 5. Génération de l'URL de vérification et du QR Code PNG Data URL
    const verifyBaseUrl = process.env.PUBLIC_VERIFY_URL || 'http://localhost:5173/verify';
    const verificationUrl = `${verifyBaseUrl}/${publicIdentifier}`;

    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // 6. Sauvegarde en Base de Données via Prisma
    const createdById = req.user?.sub;

    if (!createdById) {
      res.status(401).json({ status: 'fail', message: 'Utilisateur non identifié.' });
      return;
    }

    const certificate = await prisma.certificate.create({
      data: {
        publicIdentifier,
        studentFirstName: studentFirstName.trim(),
        studentLastName: studentLastName.trim(),
        degreeTitle: degreeTitle.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        grade: grade.trim(),
        issueDate: new Date(issueDate),
        canonicalHash,
        qrCodeDataUrl,
        status: 'ISSUED',
        universityId,
        createdById,
        metadataJson: metadataJson ? JSON.parse(metadataJson) : null,
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

    // 7. Envoi de la réponse JSON
    res.status(201).json({
      status: 'success',
      message: 'Diplôme émis et certifié avec succès.',
      certificate: {
        id: certificate.id,
        publicIdentifier: certificate.publicIdentifier,
        canonicalHash: certificate.canonicalHash,
        verificationUrl,
        qrCodeDataUrl: certificate.qrCodeDataUrl,
        studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
        degreeTitle: certificate.degreeTitle,
        fieldOfStudy: certificate.fieldOfStudy,
        grade: certificate.grade,
        issueDate: certificate.issueDate,
        universityName: certificate.university.name,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'émission du diplôme :", error);

    // Prise en compte de la contrainte d'unicité Prisma (P2002)
    if ((error as any).code === 'P2002') {
      res.status(409).json({
        status: 'fail',
        message: "Un diplôme avec cet identifiant ou cette empreinte existe déjà.",
      });
      return;
    }

    res.status(500).json({
      status: 'error',
      message: "Erreur interne lors de l'émission du diplôme.",
    });
  }
});

export default router;
const router = Router();

// Route d'ingestion Batch : Réservée aux ADMIN_UNIV et SUPERADMIN_MINESUP
router.post(
  '/batch/upload',
  authenticateJWT,
  authorizeRoles('ADMIN_UNIV', 'SUPERADMIN_MINESUP'),
  (req, res) => {
    // req.user est typé et garanti d'exister ici
    const universityId = req.user?.universityId;

    res.status(200).json({
      message: 'Fichier reçu et en cours de traitement',
      tenant: universityId,
      processedBy: req.user?.email
    });
  }
);

export default router;