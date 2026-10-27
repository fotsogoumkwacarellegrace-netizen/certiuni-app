/**
 * Fixtures de test étendues - Features REC-17 à REC-23
 * Services, facturation et suivi Recruteur
 */

// REC-17: Données de test services/tarifs
export const REC_TEST_AVAILABLE_SERVICES = [
  {
    id: 'service-001',
    name: 'Vérification de diplôme',
    description: 'Vérification de l authenticité des diplômes',
    type: 'VERIFICATION',
    isActive: true,
    beneficiaries: ['RECRUITER'] as const,
    tariffs: [
      { name: 'base', price: 49.99, type: 'FIXED' },
      { name: 'urgent', price: 79.99, type: 'FIXED' },
    ],
    currency: 'XOF',
  },
  {
    id: 'service-002',
    name: 'Attestation de réussite',
    description: 'Attestation de validation d étude',
    type: 'ATTESTATION',
    isActive: true,
    beneficiaries: ['RECRUITER'] as const,
    tariffs: [{ name: 'base', price: 29.99, type: 'FIXED' }],
    currency: 'XOF',
  },
];

// REC-18: Données de test demande vérification manuelle
export const REC_TEST_MANUAL_VERIFICATION = {
  type: 'MANUAL' as const,
  targetType: 'DOCUMENT' as const,
  targetId: 'doc-001',
  description: 'Validation manuelle requise pour document spécial',
  urgency: 'HIGH' as const,
};

// REC-19: Données de test suivi demande
export const REC_TEST_REQUEST_TRACKING = {
  requestId: 'req-001',
  status: 'IN_PROGRESS' as const,
  student: {
    firstName: 'Test',
    lastName: 'Etudiant',
    email: 'student@test.com',
  },
  service: {
    name: 'Vérification de diplôme',
    price: 49.99,
  },
  assignedRecruiter: {
    firstName: 'Recruteur',
    lastName: 'Assigné',
    email: 'recruiter@test.com',
  },
  history: [
    {
      timestamp: new Date(),
      action: 'REQUEST_CREATED',
      admin: { firstName: 'System', lastName: 'Admin', email: 'system@certiuni.com' },
    },
  ],
};

// REC-20: Données de test prix avant confirmation
export const REC_TEST_PRICE_CONFIRMATION = {
  service: 'Vérification de diplôme',
  basePrice: 49.99,
  additionalFees: 0,
  totalPrice: 49.99,
  currency: 'XOF',
  validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

// REC-21: Données de test historique paiement
export const REC_TEST_PAYMENT_HISTORY = {
  payments: [
    {
      id: 'pay-001',
      amount: 49.99,
      status: 'SUCCEEDED' as const,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      user: { firstName: 'Test', lastName: 'User', email: 'user@test.com' },
      service: { name: 'Vérification de diplôme', id: 'service-001' },
    },
  ],
  total: 1,
  hasMore: false,
};

// REC-22: Données de test documents opération
export const REC_TEST_OPERATION_DOCUMENTS = {
  operationId: 'req-001',
  documents: [
    {
      id: 'doc-001',
      originalname: 'diplome.pdf',
      type: 'PDF',
      size: 1024 * 500,
      downloadUrl: '/api/recruiter/documents/doc-001/download',
      status: 'ACTIVE',
    },
  ],
  canDownload: true,
};

// REC-23: Données de test gestion demande
export const REC_TEST_MANAGE_REQUEST = {
  requestId: 'req-001',
  action: 'CANCEL' as const,
  reason: 'Demande annulée par le recruteur',
  newStatus: 'CANCELLED' as const,
};