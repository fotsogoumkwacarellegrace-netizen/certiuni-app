/**
 * Fixtures de test fictives - Espace Recruteur (REC)
 * Données simplifiées pour validation des endpoints
 */

// Données REC-01: Compte recruteur
export interface RecruiterProfileFixture {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'RECRUITER';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  companyName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Données REC-04: Document
export interface DocumentFixture {
  id: string;
  title: string;
  type: 'DIPLOME' | 'ATTESTATION' | 'ATTESTATION_CERTIFIEE';
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  issuer: string;
  beneficiary: string;
}

// Données REC-05: Fichier upload
export interface UploadFileFixture {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Données REC-06: Résultat vérification
export interface VerificationResultFixture {
  requestId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
  student: {
    firstName: string;
    lastName: string;
    email: string;
  };
  service: {
    name: string;
    price: number;
  };
  documents: { id: string; title: string; status: string }[];
}

// Données REC-11: Fichier import lot
export interface BatchImportFileFixture {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Données REC-12: Enregistrement lot
export interface BatchRecordFixture {
  email: string;
  documentId: string;
  type: string;
}

// Données REC-15: Résultats lot
export interface BatchResultsFixture {
  totalProcessed: number;
  successful: number;
  failed: number;
  successRate: number;
  errors: string[];
}