/**
 * Fixtures de test fictives - Partie 2 ETU-08 à ETU-14
 */

// ETU-08: Données de test lien sécurisé
export const ETU_TEST_SECURE_LINK = {
  linkToken: 'secure-link-doc-001-stu-001-1234567890',
  documentId: 'doc-001',
  documentTitle: 'Diplôme de Licence',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  canShareWithRecruiters: true,
};

// ETU-09: Données de test QR code
export const ETU_TEST_QR_CODE = {
  qrCodeData: {
    documentId: 'doc-001',
    verificationCode: 'VERIF-DOC-001',
    studentId: 'stu-001',
    canVerify: true,
  },
  qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/5+hHgAFgwJ/l5YAAAAASUVORK5CYII=',
  verificationUrl: '/api/verification/doc-001',
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

// ETU-10: Données de test partage avec recruteur
export const ETU_TEST_SHARE_RECRUITER = {
  documentId: 'doc-001',
  studentId: 'stu-001',
  recruiterEmail: 'recruiter@test.com',
  comment: 'Document partagé pour vérification',
  sharedAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

// ETU-11: Données de test documents par statut
export const ETU_TEST_DOCUMENTS_STATUS = {
  status: 'EXPIRED' as const,
  documents: [
    {
      id: 'doc-003',
      title: 'Diplôme Expiré',
      type: 'DIPLOME',
      status: 'EXPIRED',
      issuedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    },
  ],
};

// ETU-12: Données de test demande correction
export const ETU_TEST_DOCUMENT_CORRECTION = {
  documentId: 'doc-001',
  studentId: 'stu-001',
  field: 'name' as const,
  currentValue: 'Ancien Nom',
  requestedValue: 'Nouveau Nom',
  justification: 'Erreur sur le nom de famille à la naissance',
};

// ETU-13: Données de test catalogue services
export const ETU_TEST_AVAILABLE_SERVICES = {
  studentId: 'stu-001',
  universityId: 'univ-001',
  availableServices: [
    {
      id: 'service-001',
      name: 'Attestation de réussite',
      description: 'Attestation de réussite aux examens',
      price: 29.99,
      duration: 'Instantanee',
      beneficiaries: 'Étudiant',
    },
    {
      id: 'service-002',
      name: 'Relevé de notes',
      description: 'Relevé officiel des notes',
      price: 49.99,
      duration: '3-5 jours',
      beneficiaries: 'Étudiant',
    },
  ],
  existingRequests: ['req-001'],
};

// ETU-14: Données de test demande attestation
export const ETU_TEST_REQUEST_ATTESTATION = {
  requestId: 'req-001',
  studentId: 'stu-001',
  serviceId: 'service-001',
  type: 'ATTENDANCE',
  status: 'PENDING',
  details: { type: 'GRADUATION' },
};