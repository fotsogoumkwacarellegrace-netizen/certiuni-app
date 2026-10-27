/**
 * Fixtures de test fictives pour validation backend CertiUni
 * Utilisés par les tests d'intégration ADM/ETU/UNI/REC
 *
 * Toutes les données sont fictives et sans rapport avec des personnes réelles.
 */

// ADM-01 to ADM-06: Données de test comptes et institutions
export const ADM_TEST_USER = {
  id: 'test-user-adm-001',
  email: 'adm.test@certiuni.demo',
  firstName: 'Test',
  lastName: 'Admin',
  role: 'SUPER_ADMIN' as const,
  status: 'ACTIVE',
  universityId: 'test-univ-001',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ADM_TEST_USER_PENDING = {
  ...ADM_TEST_USER,
  status: 'PENDING',
};

export const ADM_TEST_USER_SUSPENDED = {
  ...ADM_TEST_USER,
  status: 'SUSPENDED',
};

export const ADM_TEST_INSTITUTION = {
  id: 'test-institution-001',
  name: 'Université de Test',
  code: 'UT-001',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ADM_TEST_INSTITUTION_PENDING = {
  ...ADM_TEST_INSTITUTION,
  status: 'PENDING',
};

// ADM-07 to ADM-13: Données de test services etalertes
export const ADM_TEST_SERVICE = {
  id: 'test-service-001',
  name: 'Service de Test',
  description: 'Service de test unitaire',
  serviceType: 'GENERAL' as const,
  isActive: true,
  institutionId: 'test-institution-001',
  createdAt: new Date(),
};

export const ADM_TEST_TECHNICAL_ALERT = {
  id: 'test-alert-001',
  service: 'API_WEBHOOKS' as const,
  message: 'Alerte de test pour validation',
  severity: 'LOW' as const,
  createdAt: new Date(),
};

export const ADM_TEST_PAYMENT = {
  id: 'test-payment-001',
  amount: 49.99,
  currency: 'XAF',
  status: 'SUCCEEDED' as const,
  provider: 'STRIPE' as const,
  userId: 'test-user-adm-001',
  institutionId: 'test-institution-001',
  createdAt: new Date(),
};

// ADM-14 to ADM-17: Données de test reporting
export const ADM_TEST_REPORT = {
  id: 'test-report-001',
  type: 'GLOBAL_SUMMARY' as const,
  title: 'Rapport de Test',
  format: 'JSON' as const,
  data: { totalUsers: 100, activeUsers: 85 },
  createdBy: 'test-user-adm-001',
  createdAt: new Date(),
};

export const ADM_TEST_EXPORT = {
  exportType: 'users' as const,
  format: 'JSON' as const,
  recordCount: 50,
  exportedBy: 'test-user-adm-001',
  exportedAt: new Date(),
};

// ADM-18 to ADM-23: Données de test document governance
export const ADM_TEST_DOCUMENT = {
  id: 'test-doc-001',
  title: 'Document de Test',
  type: 'CERTIFICAT' as const,
  status: 'ACTIVE' as const,
  institutionId: 'test-institution-001',
  createdAt: new Date(),
};

export const ADM_TEST_SECURE_LINK = {
  id: 'test-link-001',
  documentId: 'test-doc-001',
  token: 'test-token-001-expires-2026',
  expiresAt: new Date(Date.now() + 3600000), // 1 heure
  status: 'ACTIVE' as const,
  createdBy: 'test-user-adm-001',
  institutionId: 'test-institution-001',
};

export const ADM_TEST_AUDIT_LOG = {
  id: 'test-audit-001',
  action: 'TOGGLE_ACCOUNT_STATUS',
  adminId: 'test-user-adm-001',
  targetType: 'USER' as const,
  targetId: 'test-user-adm-001',
  details: { newStatus: 'ACTIVE', reason: 'Test validation' },
  timestamp: new Date(),
};

// ETU-01 to ETU-02: Données de test étudiant
export const ETU_TEST_PROFILE = {
  id: 'test-student-001',
  email: 'student.test@certiuni.demo',
  firstName: 'Test',
  lastName: 'Etudiant',
  role: 'STUDENT' as const,
  status: 'ACTIVE',
  universityId: 'test-univ-001',
  programId: 'test-program-001',
  createdAt: new Date(),
};

export const ETU_TEST_DOCUMENT = {
  id: 'test-edu-doc-001',
  title: 'Diplôme de Test',
  type: 'DIPLOME' as const,
  status: 'ACTIVE' as const,
  studentId: 'test-student-001',
  institutionId: 'test-institution-001',
  createdAt: new Date(),
};

// UNI-01 to UNI-10: Données de test université
export const UNI_TEST_UNIVERSITY = {
  id: 'test-univ-001',
  name: 'Université de Test',
  code: 'UT-001',
  status: 'VALIDATED' as const,
  createdAt: new Date(),
};

export const UNI_TEST_PROGRAM = {
  id: 'test-program-001',
  name: 'Licence Test',
  description: 'Programme de test unitaire',
  level: 'LICENCE' as const,
  universityId: 'test-univ-001',
  createdAt: new Date(),
};

export const UNI_TEST_STUDENT = {
  ...ETU_TEST_PROFILE,
  universityId: 'test-univ-001',
};

// REC-01 to REC-10: Données de test recruteur
export const REC_TEST_RECRUITER = {
  id: 'test-recruiter-001',
  email: 'recruiter.test@certiuni.demo',
  firstName: 'Test',
  lastName: 'Recruteur',
  role: 'RECRUTER' as const,
  status: 'ACTIVE',
  companyName: 'Société de Test',
  createdAt: new Date(),
};

export const REC_TEST_VERIFICATION = {
  id: 'test-verif-001',
  documentId: 'test-doc-001',
  recipientEmail: 'recipient@test.com',
  status: 'PENDING' as const,
  createdAt: new Date(),
  requestedBy: 'test-recruiter-001',
};

// Tests de permissions rôles
export const ROLE_PERMISSION_TESTS = {
  SUPER_ADMIN: ['ALL_PERMISSIONS', 'ADM_DASHBOARD', 'ADM_USERS', 'ADM_INSTITUTIONS', 'ADM_REPORTS'],
  STUDENT: ['ETU_DASHBOARD', 'ETU_MY_DOCUMENTS', 'ETU_PROFILE'],
  RECRUTER: ['REC_VERIFICATION_UNIT', 'REC_VERIFICATION_LOT', 'REC_DASHBOARD'],
};