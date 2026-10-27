import crypto from 'crypto';
import { Request, Response, Router } from 'express';
import { prisma } from '../../config/database';
import { authenticateJwt } from '../../middlewares/auth.middleware';

const router = Router();

const generatePublicIdentifier = (universityCode: string): string => {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
};

const buildCanonicalString = (params: {
  publicIdentifier: string;
  studentLastName: string;
  studentFirstName: string;
  degreeTitle: string;
  fieldOfStudy: string;
  universityCode: string;
  issueDate: string;
}) => {
  const clean = (value: string) => value.trim().toUpperCase();

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

router.get('/:id/pdf', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: { university: true },
  });

  if (!certificate) {
    res.status(404).json({ status: 'fail', message: 'Diplôme introuvable.' });
    return;
  }

  if (!certificate.pdfUrl) {
    res.status(404).json({ status: 'fail', message: 'Aucun PDF associé à ce diplôme.' });
    return;
  }

  res.redirect(certificate.pdfUrl);
});

router.post('/issue', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      studentIdentifier,
      studentFirstName,
      studentLastName,
      studentEmail,
      degreeTitle,
      fieldOfStudy,
      grade,
      issueDate,
      universityId,
    } = req.body as {
      studentIdentifier?: string;
      studentFirstName?: string;
      studentLastName?: string;
      studentEmail?: string;
      degreeTitle?: string;
      fieldOfStudy?: string;
      grade?: string;
      issueDate?: string;
      universityId?: string;
    };

    if (!studentIdentifier || !studentFirstName || !studentLastName || !studentEmail || !degreeTitle || !fieldOfStudy || !grade || !issueDate || !universityId) {
      res.status(400).json({ status: 'fail', message: 'Tous les champs requis doivent être fournis.' });
      return;
    }

    const university = await prisma.university.findUnique({ where: { id: universityId } });
    if (!university) {
      res.status(404).json({ status: 'fail', message: 'Université introuvable.' });
      return;
    }

    const publicIdentifier = generatePublicIdentifier(university.code);
    const canonicalString = buildCanonicalString({
      publicIdentifier,
      studentLastName,
      studentFirstName,
      degreeTitle,
      fieldOfStudy,
      universityCode: university.code,
      issueDate,
    });

    const canonicalHash = crypto.createHash('sha256').update(canonicalString).digest('hex');
    const issuedById = req.user?.id;

    if (!issuedById) {
      res.status(401).json({ status: 'fail', message: 'Utilisateur non identifié.' });
      return;
    }

    const certificate = await prisma.certificate.create({
      data: {
        publicIdentifier,
        canonicalHash,
        studentIdentifier: studentIdentifier.trim(),
        studentFirstName: studentFirstName.trim(),
        studentLastName: studentLastName.trim(),
        studentEmail: studentEmail.trim(),
        degreeTitle: degreeTitle.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        grade: grade.trim(),
        issueDate: new Date(issueDate),
        status: 'ISSUED',
        universityId,
        issuedById,
      },
      include: {
        university: true,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Diplôme émis avec succès.',
      data: {
        id: certificate.id,
        publicIdentifier: certificate.publicIdentifier,
        canonicalHash: certificate.canonicalHash,
        studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
        degreeTitle: certificate.degreeTitle,
        fieldOfStudy: certificate.fieldOfStudy,
        grade: certificate.grade,
        issueDate: certificate.issueDate,
        university: {
          id: certificate.university.id,
          name: certificate.university.name,
          code: certificate.university.code,
        },
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'émission du diplôme :', error);
    res.status(500).json({ status: 'error', message: 'Erreur interne lors de l\'émission du diplôme.' });
  }
});

export default router;

//     // 6. Mise à jour du diplôme dans la base de données
//     const updatedCertificate = await prisma.certificate.update({
//       where: { id },
//       data: {
//         status: 'REVOKED',
//         revocationReason: reason.trim(),
//         revokedAt: new Date(),
//         revokedById: currentUser.sub,
//       },
//       include: {
//         university: {
//           select: {
//             name: true,
//             code: true,
//           },
//         },
//       },
//     });

//     // 7. Réponse JSON
//     res.status(200).json({
//       status: 'success',
//       message: 'Le diplôme a été révoqué avec succès.',
//       certificate: {
//         id: updatedCertificate.id,
//         publicIdentifier: updatedCertificate.publicIdentifier,
//         studentName: `${updatedCertificate.studentFirstName} ${updatedCertificate.studentLastName}`,
//         degreeTitle: updatedCertificate.degreeTitle,
//         status: updatedCertificate.status,
//         revocationReason: updatedCertificate.revocationReason,
//         revokedAt: updatedCertificate.revokedAt,
//         universityName: updatedCertificate.university.name,
//       },
//     });
//   } catch (error) {
//     console.error('Erreur lors de la révocation du diplôme :', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Une erreur interne est survenue lors de la révocation.',
//     });
//   }
// });



// import { Router, Request, Response } from 'express';
// import crypto from 'crypto';
// import QRCode from 'qrcode';
// import { prisma } from '../server';
// import { authenticateJWT } from '../middlewares/auth.middleware';

// const router = Router();

// /**
//  * Helper: Génère un identifiant public unique (Ex: UY1-2026-A8F9K2)
//  */
// const generatePublicIdentifier = (universityCode: string): string => {
//   const year = new Date().getFullYear();
//   const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
//   return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
// };

// /**
//  * Helper: Construit la chaîne canonique normalisée (Déterministe)
//  * Format : ID|NOM|PRENOM|DIPLOME|DOMAINE|UNIVERSITE|DATE
//  */
// const buildCanonicalString = (params: {
//   publicIdentifier: string;
//   studentLastName: string;
//   studentFirstName: string;
//   degreeTitle: string;
//   fieldOfStudy: string;
//   universityCode: string;
//   issueDate: string;
// }): string => {
//   const clean = (str: string) => str.trim().toUpperCase();

//   return [
//     clean(params.publicIdentifier),
//     clean(params.studentLastName),
//     clean(params.studentFirstName),
//     clean(params.degreeTitle),
//     clean(params.fieldOfStudy),
//     clean(params.universityCode),
//     clean(params.issueDate),
//   ].join('|');
// };

// /**
//  * POST /api/v1/certificates/issue
//  * Émet un nouveau diplôme (Protégé par JWT)
//  */
// router.post('/issue', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
//   try {
//     const {
//       studentFirstName,
//       studentLastName,
//       degreeTitle,
//       fieldOfStudy,
//       grade,
//       issueDate,
//       universityId,
//       metadataJson,
//     } = req.body;

//     // 1. Validation basique des données d'entrée
//     if (
//       !studentFirstName ||
//       !studentLastName ||
//       !degreeTitle ||
//       !fieldOfStudy ||
//       !grade ||
//       !issueDate ||
//       !universityId
//     ) {
//       res.status(400).json({
//         status: 'fail',
//         message: 'Tous les champs obligatoires doivent être renseignés.',
//       });
//       return;
//     }

//     // 2. Vérification de l'existence de l'établissement
//     const university = await prisma.university.findUnique({
//       where: { id: universityId },
//     });

//     if (!university) {
//       res.status(404).json({
//         status: 'fail',
//         message: `Établissement introuvable avec l'ID : ${universityId}`,
//       });
//       return;
//     }

//     // 3. Génération de l'identifiant public unique
//     const publicIdentifier = generatePublicIdentifier(university.code);

//     // 4. Calcul du Hash SHA-256 Canonique
//     const canonicalString = buildCanonicalString({
//       publicIdentifier,
//       studentLastName,
//       studentFirstName,
//       degreeTitle,
//       fieldOfStudy,
//       universityCode: university.code,
//       issueDate,
//     });

//     const canonicalHash = crypto
//       .createHash('sha256')
//       .update(canonicalString)
//       .digest('hex');

//     // 5. Génération de l'URL de vérification et du QR Code PNG Data URL
//     const verifyBaseUrl = process.env.PUBLIC_VERIFY_URL || 'http://localhost:5173/verify';
//     const verificationUrl = `${verifyBaseUrl}/${publicIdentifier}`;

//     const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
//       errorCorrectionLevel: 'H',
//       type: 'image/png',
//       margin: 2,
//       width: 300,
//       color: {
//         dark: '#000000',
//         light: '#FFFFFF',
//       },
//     });

//     // 6. Sauvegarde en Base de Données via Prisma
//     const createdById = req.user?.sub;

//     if (!createdById) {
//       res.status(401).json({ status: 'fail', message: 'Utilisateur non identifié.' });
//       return;
//     }

//     const certificate = await prisma.certificate.create({
//       data: {
//         publicIdentifier,
//         studentFirstName: studentFirstName.trim(),
//         studentLastName: studentLastName.trim(),
//         degreeTitle: degreeTitle.trim(),
//         fieldOfStudy: fieldOfStudy.trim(),
//         grade: grade.trim(),
//         issueDate: new Date(issueDate),
//         canonicalHash,
//         qrCodeDataUrl,
//         status: 'ISSUED',
//         universityId,
//         createdById,
//         metadataJson: metadataJson ? JSON.parse(metadataJson) : null,
//       },
//       include: {
//         university: {
//           select: {
//             name: true,
//             code: true,
//             logoUrl: true,
//           },
//         },
//       },
//     });

//     // 7. Envoi de la réponse JSON
//     res.status(201).json({
//       status: 'success',
//       message: 'Diplôme émis et certifié avec succès.',
//       certificate: {
//         id: certificate.id,
//         publicIdentifier: certificate.publicIdentifier,
//         canonicalHash: certificate.canonicalHash,
//         verificationUrl,
//         qrCodeDataUrl: certificate.qrCodeDataUrl,
//         studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
//         degreeTitle: certificate.degreeTitle,
//         fieldOfStudy: certificate.fieldOfStudy,
//         grade: certificate.grade,
//         issueDate: certificate.issueDate,
//         universityName: certificate.university.name,
//       },
//     });
//   } catch (error) {
//     console.error("Erreur lors de l'émission du diplôme :", error);

//     // Prise en compte de la contrainte d'unicité Prisma (P2002)
//     if ((error as any).code === 'P2002') {
//       res.status(409).json({
//         status: 'fail',
//         message: "Un diplôme avec cet identifiant ou cette empreinte existe déjà.",
//       });
//       return;
//     }

//     res.status(500).json({
//       status: 'error',
//       message: "Erreur interne lors de l'émission du diplôme.",
//     });
//   }
// });

// export default router;