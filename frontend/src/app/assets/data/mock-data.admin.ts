export interface DashboardStat {
  label: string;
  value: string;
  delta: string;
}

export interface ActiviteRecente {
  date: string;
  heure: string;
  description: string;
  actionLabel: string;
  statut?: 'success' | 'suspect' | 'info';
}

export interface DiplomaTemplate {
  id: string;
  filiere: string;
  intitule: string;
  version: string;
  dateMaj: string;
}

export interface CsvErreur {
  ligne: number;
  colonne: string;
  valeurTrouvee: string;
  erreur: string;
}

export interface CsvValidationResult {
  fichier: string;
  lignesDetectees: number;
  lignesValides: number;
  lignesAvecErreurs: number;
  erreurs: CsvErreur[];
}

export interface EtapeGeneration {
  label: string;
  fait: boolean;
}

export interface EchantillonDiplome {
  nom: string;
  reference: string;
}

export const MOCK_INSTITUTION = {
  nom: 'Université de Technologie de Yaoundé',
  adminNom: 'Admin Institution'
};

export const MOCK_DASHBOARD_STATS: DashboardStat[] = [
  { label: 'Diplômes émis', value: '12 450', delta: '+1 245 ce mois' },
  { label: 'En attente de validation', value: '125', delta: '+12 ce mois' },
  { label: 'Vérifications', value: '8 542', delta: '+842 ce mois' },
  { label: 'Vérifications suspectes', value: '12', delta: '+3 ce mois' }
];

export const MOCK_ACTIVITE_RECENTE: ActiviteRecente[] = [
  {
    date: '26/05/2024',
    heure: '14:32',
    description: 'Nouveaux diplômes générés (Licence Informatique 2024)',
    actionLabel: '1 250 diplômes',
    statut: 'info'
  },
  {
    date: '26/05/2024',
    heure: '11:15',
    description: 'Diplôme CERT-2024-00012S vérifié',
    actionLabel: 'Authentique',
    statut: 'success'
  },
  {
    date: '25/05/2024',
    heure: '16:45',
    description: 'Tentative de vérification suspecte',
    actionLabel: 'Voir',
    statut: 'suspect'
  },
  {
    date: '25/05/2024',
    heure: '09:10',
    description: 'Nouveau design créé (Master Réseaux)',
    actionLabel: 'Voir tout',
    statut: 'info'
  }
];

export const MOCK_DIPLOMA_TEMPLATES: DiplomaTemplate[] = [
  { id: 'tpl-licence-gl', filiere: 'Génie Logiciel', intitule: 'Licence', version: 'Design v2', dateMaj: '12/04/2024' },
  { id: 'tpl-master-info', filiere: 'Informatique', intitule: 'Master', version: 'Design v1', dateMaj: '10/03/2024' },
  { id: 'tpl-licence-rt', filiere: 'Réseaux & Télécoms', intitule: 'Licence', version: 'Design v1', dateMaj: '05/02/2024' }
];

export const REQUIRED_CSV_COLUMNS = [
  'matricule',
  'nom',
  'prenom',
  'date_naissance',
  'filiere',
  'niveau',
  'mention',
  'annee_academique',
  'date_obtention',
  'numero_diplome'
];

export const MOCK_CSV_VALIDATION: CsvValidationResult = {
  fichier: 'diplomes_licence_gl_2024.csv',
  lignesDetectees: 1250,
  lignesValides: 1238,
  lignesAvecErreurs: 12,
  erreurs: [
    { ligne: 128, colonne: 'matricule', valeurTrouvee: '', erreur: 'Matricule manquant' },
    { ligne: 452, colonne: 'numero_diplome', valeurTrouvee: 'CERT-2024-000452', erreur: 'Numéro déjà utilisé' },
    { ligne: 871, colonne: 'date_naissance', valeurTrouvee: '32/13/2000', erreur: 'Date invalide' },
    { ligne: 1022, colonne: 'nom', valeurTrouvee: '', erreur: 'Nom manquant' },
    { ligne: 1105, colonne: 'filiere', valeurTrouvee: '', erreur: 'Filière manquante' }
  ]
};

export const MOCK_ETAPES_GENERATION: EtapeGeneration[] = [
  { label: 'Création des PDF', fait: true },
  { label: 'Ajout des QR Codes', fait: true },
  { label: 'Signature numérique', fait: true },
  { label: 'Enregistrement dans CertiUni', fait: false }
];

export const MOCK_CONTROLE_QUALITE = {
  fichiersGeneres: { valeur: '1 238', pourcentage: 100 },
  qrCodes: { valeur: '1 238', pourcentage: 100 },
  signatures: { valeur: '1 238', pourcentage: 100 },
  erreursDetectees: { valeur: '0', pourcentage: 0 }
};

export const MOCK_ECHANTILLON_DIPLOMES: EchantillonDiplome[] = [
  { nom: 'Jean Dupont', reference: 'CERT-2024-000001' },
  { nom: 'Marie Claire', reference: 'CERT-2024-000002' },
  { nom: 'Paul Martin', reference: 'CERT-2024-000003' },
  { nom: 'Sophie Nseng', reference: 'CERT-2024-000004' },
  { nom: 'David Tchuente', reference: 'CERT-2024-000005' }
];


export type StatutDiplome = 'Actif' | 'Révoqué';
 
export interface DiplomeEmis {
  id: string;
  numero: string;
  titulaireNom: string;
  matricule: string;
  type: string;
  filiere: string;
  promotion: string;
  dateEmission: string;
  dateNaissance: string;
  lieuNaissance: string;
  mention: string;
  anneeAcademique: string;
  fichierPdf: string;
  hashDocument: string;
  idCertUni: string;
  statut: StatutDiplome;
}
 
export const MOCK_DIPLOMES_EMIS: DiplomeEmis[] = [
  {
    id: 'CERT-2026-000123',
    numero: 'CERT-2026-000123',
    titulaireNom: 'Jean Dupont',
    matricule: '16GL1234',
    type: 'Licence',
    filiere: 'Génie Logiciel',
    promotion: '2025/2026',
    dateEmission: '26/05/2026',
    dateNaissance: '12/04/2003',
    lieuNaissance: 'Yaoundé',
    mention: 'Bien',
    anneeAcademique: '2025/2026',
    fichierPdf: 'cert-2026-000123.pdf',
    hashDocument: '3f6a7c2e6d9a7b1a…',
    idCertUni: '3f6a7c2e6d9a7b1a',
    statut: 'Actif'
  },
  {
    id: 'CERT-2026-000124',
    numero: 'CERT-2026-000124',
    titulaireNom: 'Marie Claire',
    matricule: '16GL1250',
    type: 'Licence',
    filiere: 'Génie Logiciel',
    promotion: '2025/2026',
    dateEmission: '26/05/2026',
    dateNaissance: '03/02/2003',
    lieuNaissance: 'Douala',
    mention: 'Assez Bien',
    anneeAcademique: '2025/2026',
    fichierPdf: 'cert-2026-000124.pdf',
    hashDocument: '8a2b9f1c4d6e3a0b…',
    idCertUni: '8a2b9f1c4d6e3a0b',
    statut: 'Actif'
  },
  {
    id: 'CERT-2026-000125',
    numero: 'CERT-2026-000125',
    titulaireNom: 'Paul Martin',
    matricule: '16GL1245',
    type: 'Licence',
    filiere: 'Génie Logiciel',
    promotion: '2025/2026',
    dateEmission: '26/05/2026',
    dateNaissance: '21/09/2002',
    lieuNaissance: 'Bafoussam',
    mention: 'Bien',
    anneeAcademique: '2025/2026',
    fichierPdf: 'cert-2026-000125.pdf',
    hashDocument: '1d4e8b7a2c5f9d3e…',
    idCertUni: '1d4e8b7a2c5f9d3e',
    statut: 'Actif'
  },
  {
    id: 'CERT-2026-000126',
    numero: 'CERT-2026-000126',
    titulaireNom: 'Sophie Mengue',
    matricule: '16GL1288',
    type: 'Licence',
    filiere: 'Génie Logiciel',
    promotion: '2025/2026',
    dateEmission: '25/05/2026',
    dateNaissance: '14/07/2003',
    lieuNaissance: 'Yaoundé',
    mention: 'Très Bien',
    anneeAcademique: '2025/2026',
    fichierPdf: 'cert-2026-000126.pdf',
    hashDocument: '7c1a3e9d5b8f2a6c…',
    idCertUni: '7c1a3e9d5b8f2a6c',
    statut: 'Actif'
  },
  {
    id: 'CERT-2026-000127',
    numero: 'CERT-2026-000127',
    titulaireNom: 'David Tchouente',
    matricule: '16GL1234',
    type: 'Licence',
    filiere: 'Génie Logiciel',
    promotion: '2025/2026',
    dateEmission: '25/05/2026',
    dateNaissance: '30/11/2002',
    lieuNaissance: 'Douala',
    mention: 'Bien',
    anneeAcademique: '2025/2026',
    fichierPdf: 'cert-2026-000127.pdf',
    hashDocument: '5e9a2c7b4d1f8a3e…',
    idCertUni: '5e9a2c7b4d1f8a3e',
    statut: 'Révoqué'
  }
];
 
// --- Logs de vérification ---
 
export type StatutVerification = 'Authentique' | 'Révoqué' | 'Non validé';
export type VerifiePar = 'Particulier(e)' | 'Étudiant(e)';
 
export interface LogVerification {
  date: string;
  heure: string;
  numeroDiplome: string;
  verifiePar: VerifiePar;
  localisation: string;
  statut: StatutVerification;
  type: 'QR Code' | 'Numéro';
}
 
export const MOCK_LOGS_VERIFICATION: LogVerification[] = [
  { date: '26/05/2026', heure: '14:32', numeroDiplome: 'CERT-2026-000123', verifiePar: 'Particulier(e)', localisation: 'Yaoundé, CM', statut: 'Authentique', type: 'QR Code' },
  { date: '26/05/2026', heure: '11:02', numeroDiplome: 'CERT-2026-000125', verifiePar: 'Étudiant(e)', localisation: 'Bafoussam, CM', statut: 'Authentique', type: 'QR Code' },
  { date: '25/05/2026', heure: '18:45', numeroDiplome: 'CERT-2026-000127', verifiePar: 'Particulier(e)', localisation: 'Douala, CM', statut: 'Révoqué', type: 'Numéro' },
  { date: '24/05/2026', heure: '10:44', numeroDiplome: 'CERT-2026-000128', verifiePar: 'Particulier(e)', localisation: 'Paris, FR', statut: 'Non validé', type: 'Numéro' },
  { date: '24/05/2026', heure: '19:30', numeroDiplome: 'CERT-2026-000129', verifiePar: 'Étudiant(e)', localisation: 'Dakar, SN', statut: 'Non validé', type: 'QR Code' },
  { date: '24/05/2026', heure: '16:05', numeroDiplome: 'CERT-2026-000131', verifiePar: 'Particulier(e)', localisation: 'Douala, CM', statut: 'Authentique', type: 'QR Code' },
  { date: '24/05/2026', heure: '08:12', numeroDiplome: 'CERT-2026-000132', verifiePar: 'Étudiant(e)', localisation: 'Yaoundé, CM', statut: 'Non validé', type: 'QR Code' }
];
 