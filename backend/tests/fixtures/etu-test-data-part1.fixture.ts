/**
 * Fixtures de test fictives - Partie 1 ETU-01 à ETU-07
 * Données de test pour valider les fonctionnalités Étudiant
 */

// ETU-01: Données de test création/activation compte
export const ETU_TEST_CREATE_ACCOUNT = {
  email: 'student.test@certiuni.demo',
  firstName: 'Test',
  lastName: 'Étudiant',
  universityId: 'univ-001',
};

// ETU-02: Données de test dashboard stats
export const ETU_TEST_DASHBOARD_STATS = {
  studentId: 'stu-001',
  issuedCertificates: 3,
  pendingRequests: 2,
  notifications: 5,
  activeVerifications: 1,
};

// ETU-03: Données de test association institution
export const ETU_TEST_ASSOCIATE_INSTITUTION = {
  studentId: 'stu-001',
  institutionId: 'univ-001',
  promotionId: 'promo-2024',
};

// ETU-04: Données de test établissements/programmes
export const ETU_TEST_INSTITUTIONS_PROGRAMS = {
  university: {
    id: 'univ-001',
    name: 'Université de Test',
    code: 'UT-001',
  },
  programs: [
    { id: 'prog-001', name: 'Licence Informatique', faculty: 'Sciences', department: 'Informatique' },
    { id: 'prog-002', name: 'Licence Mathématiques', faculty: 'Sciences', department: 'Mathématiques' },
  ],
};

// ETU-05: Données de test documents
export const ETU_TEST_DOCUMENTS = [
  {
    id: 'doc-001',
    title: 'Diplôme de Licence',
    type: 'DIPLOME' as const,
    status: 'VERIFIED' as const,
    issuedAt: new Date(),
    pdfUrl: 'https://certiuni.edu/pdf/doc-001.pdf',
    verificationCode: 'VERIF-DOC-001',
  },
  {
    id: 'doc-002',
    title: 'Attestation de Participation',
    type: 'ATTESTATION' as const,
    status: 'PENDING' as const,
    issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

// ETU-06: Données de test détails document
export const ETU_TEST_DOCUMENT_DETAILS = {
  documentId: 'doc-001',
  studentId: 'stu-001',
  title: 'Diplôme de Licence',
  type: 'DIPLOME',
  status: 'VERIFIED',
  issuer: {
    id: 'univ-001',
    name: 'Université de Test',
    code: 'UT-001',
  },
  verificationCode: 'VERIF-DOC-001',
};

// ETU-07: Données de test téléchargement PDF
export const ETU_TEST_DOWNLOAD_PDF = {
  documentId: 'doc-001',
  studentId: 'stu-001',
  pdfUrl: 'https://certiuni.edu/pdf/doc-001.pdf',
  downloadToken: 'download-doc-001-stu-001',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
};