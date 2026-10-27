/**
 * Fixtures de test fictives - Partie 3 ETU-15 à ETU-23
 */

// ETU-15: Données de test demande relevé
export const ETU_TEST_REQUEST_TRANSCRIPT = {
  requestId: 'req-002',
  studentId: 'stu-001',
  serviceId: 'service-002',
  type: 'TRANSCRIPT',
  status: 'IN_PROGRESS',
  details: { includeRank: true, includeCourses: false },
};

// ETU-16: Données de test demande duplicata
export const ETU_TEST_REQUEST_DUPLICATE = {
  requestId: 'req-003',
  studentId: 'stu-001',
  serviceId: 'service-001',
  type: 'DUPLICATE',
  status: 'PENDING',
  subtype: 'DIPLOME',
  details: { reason: 'Document perdu lors déménagement' },
};

// ETU-17: Données de test demande certification
export const ETU_TEST_REQUEST_CERTIFICATION = {
  requestId: 'req-004',
  studentId: 'stu-001',
  serviceId: 'service-001',
  type: 'CERTIFICATION',
  status: 'PENDING',
  subtype: 'FULL',
  details: { targetFields: ['nom', 'prenom', 'date_obtention'] },
};

// ETU-18: Données de test soumettre justificatifs
export const ETU_TEST_SUBMIT_JUSTIFICATIFS = {
  studentId: 'stu-001',
  requestId: 'req-001',
  files: [
    {
      originalname: 'justificatif_presence.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 200,
      buffer: Buffer.from('', 'utf-8'),
    },
  ],
};

// ETU-19: Données de test frais et conditions
export const ETU_TEST_SERVICE_FEES = {
  studentId: 'stu-001',
  serviceId: 'service-001',
  service: {
    id: 'service-001',
    name: 'Attestation de réussite',
    description: 'Attestation de réussite aux examens',
    price: 29.99,
    currency: 'XOF',
    duration: 'Instantanee',
  },
  conditions: 'Validité 30 jours, envoyée par email',
  existingRequests: [
    {
      id: 'req-001',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ],
};

// ETU-20: Données de test suivre statut
export const ETU_TEST_TRACK_STATUS = {
  studentId: 'stu-001',
  requestId: 'req-001',
  request: {
    id: 'req-001',
    status: 'APPROVED',
    service: { id: 'service-001', name: 'Attestation de réussite' },
    student: {
      id: 'stu-001',
      email: 'student@test.com',
      firstName: 'Test',
      lastName: 'Étudiant',
    },
  },
  statusHistory: [
    {
      status: 'PENDING',
      changedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      changedBy: 'system',
    },
    {
      status: 'IN_PROGRESS',
      changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      changedBy: 'university',
    },
    {
      status: 'APPROVED',
      changedAt: new Date(),
      changedBy: 'validateur',
    },
  ],
};

// ETU-21: Données de test demandes complément
export const ETU_TEST_SUPPLEMENTARY_REQUESTS = {
  studentId: 'stu-001',
  requestId: 'req-001',
  supplementaryRequests: [
    {
      id: 'sup-001',
      type: 'JUSTIFICATIF',
      description: 'Justificatif de présence requis',
      status: 'PENDING',
      createdBy: {
        id: 'univ-001',
        email: 'validator@univ-001.edu',
        firstName: 'Validateur',
        lastName: 'Universitaire',
        role: 'VALIDATOR',
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ],
};

// ETU-22: Données de test télécharger résultat
export const ETU_TEST_DOWNLOAD_RESULT = {
  studentId: 'stu-001',
  resultId: 'req-001',
  result: {
    id: 'req-001',
    status: 'APPROVED',
    service: { id: 'service-001', name: 'Attestation de réussite' },
  },
  downloadToken: 'final-result-req-001-stu-001',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  includes: ['resultPdf', 'receipt', 'invoice'],
};

// ETU-23: Données de test historique demandes
export const ETU_TEST_REQUEST_HISTORY = {
  studentId: 'stu-001',
  serviceId: 'service-001',
  filters: {},
  requests: [
    {
      id: 'req-001',
      status: 'APPROVED',
      type: 'ATTESTATION',
      service: { id: 'service-001', name: 'Attestation de réussite' },
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'req-002',
      status: 'IN_PROGRESS',
      type: 'TRANSCRIPT',
      service: { id: 'service-002', name: 'Relevé de notes' },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ],
  total: 2,
};

// Permissions rôles ETU
export const ROLE_PERMISSIONS_ETU = {
  STUDENT: [
    'ETU_DASHBOARD',
    'ETU_PROFILE',
    'ETU_DOCUMENTS',
    'ETU_SHARE',
    'ETU_REQUESTS',
    'ETU_SERVICE_FEES',
    'ETU_STATUS',
    'ETU_CORRECTION',
    'ETU_SUPPLEMENTARY',
  ],
};