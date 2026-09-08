import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration du client S3 (Compatible AWS S3, MinIO ou Cloudflare R2)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  // Utile si vous utilisez MinIO en local
  ...(process.env.S3_ENDPOINT && {
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  }),
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'certiuni-certificates';

/**
 * Téléverse un buffer PDF sur Amazon S3
 * @returns L'URL publique ou la clé S3 du fichier stocké
 */
export const uploadCertificatePdfToS3 = async (
  pdfBuffer: Buffer,
  publicIdentifier: string
): Promise<{ fileKey: string; fileUrl: string }> => {
  const fileKey = `certificates/${new Date().getFullYear()}/${publicIdentifier}.pdf`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
    ContentDisposition: `inline; filename="Diplome_${publicIdentifier}.pdf"`,
    Metadata: {
      publicIdentifier,
      generatedAt: new Date().toISOString(),
    },
  });

  try {
    await s3Client.send(command);

    // URL standard S3
    const fileUrl = process.env.S3_ENDPOINT
      ? `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${fileKey}`
      : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-west-3'}.amazonaws.com/${fileKey}`;

    return { fileKey, fileUrl };
  } catch (error) {
    console.error('Erreur lors du téléversement vers S3 :', error);
    throw new Error('Impossible d\'enregistrer le fichier PDF sur le stockage cloud.');
  }
};

/**
 * Génère une URL pré-signée temporaire pour télécharger le fichier en toute sécurité
 * @param fileKey La clé du fichier sur S3
 * @param expiresIn Durée de validité en secondes (par défaut 1 heure)
 */
export const getPresignedDownloadUrl = async (
  fileKey: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Supprime un fichier du bucket S3 (en cas d'annulation ou nettoyage)
 */
export const deleteCertificatePdfFromS3 = async (fileKey: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
};