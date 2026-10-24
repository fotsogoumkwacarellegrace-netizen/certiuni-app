# 04. Stratégie Cryptographique & Stockage S3 - CertiUni

Ce document spécifie les mécanismes d'intégrité des données, la méthode de calcul du hash SHA-256 canonique, la structure d'archivage S3 et la politique d'immutabilité WORM.

---

## 1. Empreinte Cryptographique (Hash SHA-256 Canonique)

Afin d'éviter qu'une variation mineure d'espacement, de saut de ligne ou d'ordre des clés dans le JSON ne génère un hash différent pour des données identiques, l'API applique une **sérialisation canonique JSON (RFC 8785)** avant le hachage.

### 1.1 Algorithme de Génération du Hash
1. Extraire la structure exacte des données du diplôme.
2. Trier toutes les clés du JSON par ordre alphabétique de manière récursive.
3. Formater la chaîne UTF-8 sans espaces ni saut de ligne inutile.
4. Appliquer l'algorithme d'empreinte `SHA-256` sur la chaîne canonique.

### 1.2 Structure des Données d'Entrée
```json
{
  "academicYear": "2025-2026",
  "degreeTitle": "MASTER",
  "fieldOfStudy": "Génie Logiciel",
  "issueDate": "2026-07-15T10:00:00.000Z",
  "studentFirstName": "Jean",
  "studentIdentifier": "MAT-2022-8901",
  "studentLastName": "Dupont",
  "universityCode": "UY1"
}

import crypto from 'crypto';
import canonicalize from 'canonicalize';

export function generateCanonicalHash(payload: Record<string, any>): string {
  // 1. Sérialisation canonique selon la norme RFC 8785
  const canonicalJson = canonicalize(payload);
  
  if (!canonicalJson) {
    throw new Error('Erreur lors de la sérialisation canonique du document.');
  }

  // 2. Génération de l'empreinte SHA-256 en hexadécimal
  return crypto.createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyDirectPublicAccessExceptViaBackendRole",
      "Effect": "Deny",
      "Principal": "*",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::certiuni-diplomas-bucket/*",
      "Condition": {
        "StringNotLike": {
          "aws:PrincipalArn": [
            "arn:aws:iam::123456789012:role/CertiUniBackendRole"
          ]
        }
      }
    }
  ]
}

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function generatePresignedDownloadUrl(fileKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 900 });
}