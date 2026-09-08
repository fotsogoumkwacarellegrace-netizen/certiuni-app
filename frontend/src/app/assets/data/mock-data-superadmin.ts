// Données temporaires pour un fonctionnement local du module Super Admin (MINESUP).
// À remplacer par les appels HTTP réels une fois le backend disponible.
// Ce fichier est indépendant de mock-data-admin.ts (module 3 - côté institution).

export interface NationalStat {
  label: string;
  value: string;
  delta: string;
}

export interface ActiviteRecenteMinesup {
  date: string;
  heure: string;
  description: string;
}

export interface VerificationPoint {
  mois: string;
  total: number;
}

export type StatutDemande = 'En attente' | 'Validée' | 'Rejetée';

export interface RepresentantLegal {
  nom: string;
  fonction: string;
  email: string;
  telephone: string;
}

export interface DemandeInscription {
  id: string;
  institution: string;
  type: 'IPES' | 'Université';
  dateDemande: string;
  statut: StatutDemande;
  domaineDns: string;
  dnsVerifie: boolean;
  adresse: string;
  email: string;
  telephone: string;
  decretFichier: string;
  decretTaille: string;
  signatureFichier: string;
  signatureTaille: string;
  representantLegal: RepresentantLegal;
}

export type StatutInstitution = 'Active' | 'Suspendue';

export interface Institution {
  id: string;
  nom: string;
  type: 'IPES' | 'Université';
  region: string;
  statut: StatutInstitution;
  dateInscription: string;
}

export interface AuditLog {
  date: string;
  heure: string;
  utilisateur: string;
  institution: string;
  action: string;
  details: string;
}

export const MOCK_SUPERADMIN = {
  nom: 'Super Admin'
};

export const MOCK_NATIONAL_STATS: NationalStat[] = [
  { label: 'Institutions', value: '142', delta: '+5 ce mois' },
  { label: 'Institutions en attente', value: '7', delta: '' },
  { label: 'Diplômes certifiés', value: '584 230', delta: '+28 450 ce mois' },
  { label: 'Vérifications', value: '1 245 892', delta: '+125 430 ce mois' }
];

export const MOCK_VERIFICATIONS_SUSPECTES = 18;

export const MOCK_ACTIVITE_RECENTE_MINESUP: ActiviteRecenteMinesup[] = [
  { date: '26/05/2024', heure: '14:32', description: "Université de Yaoundé I a généré 1 250 diplômes" },
  { date: '26/05/2024', heure: '13:15', description: "Nouvelle demande d'inscription : Institut Supérieur X" },
  { date: '25/05/2024', heure: '18:22', description: "Validation de l'institution : Université de Buea" },
  { date: '25/05/2024', heure: '09:10', description: 'Tentative de vérification suspecte détectée' }
];

// Courbe des vérifications totales de la plateforme (12 derniers mois).
export const MOCK_VERIFICATIONS_CURVE: VerificationPoint[] = [
  { mois: 'Juin', total: 62000 },
  { mois: 'Juil', total: 68500 },
  { mois: 'Août', total: 71000 },
  { mois: 'Sept', total: 79500 },
  { mois: 'Oct', total: 88000 },
  { mois: 'Nov', total: 95500 },
  { mois: 'Déc', total: 91000 },
  { mois: 'Jan', total: 102500 },
  { mois: 'Fév', total: 110000 },
  { mois: 'Mars', total: 118500 },
  { mois: 'Avr', total: 129000 },
  { mois: 'Mai', total: 125430 }
];

export const MOCK_DEMANDES_INSCRIPTION: DemandeInscription[] = [
  {
    id: 'DEM-2024-0001',
    institution: 'Institut Supérieur X',
    type: 'IPES',
    dateDemande: '26/05/2024',
    statut: 'En attente',
    domaineDns: 'www.isx.cm',
    dnsVerifie: true,
    adresse: 'Yaoundé - Cameroun',
    email: 'contact@isx.cm',
    telephone: '+237 6 11 22 33 44',
    decretFichier: 'decret_isx.pdf',
    decretTaille: '1.2 Mo',
    signatureFichier: 'signature_legale.p7s',
    signatureTaille: '150 Ko',
    representantLegal: {
      nom: 'Pr. Paul Ntone',
      fonction: 'Directeur Général',
      email: 'contact@isx.cm',
      telephone: '+237 6 11 22 33 44'
    }
  },
  {
    id: 'DEM-2024-0002',
    institution: "Université de l'Ouest",
    type: 'Université',
    dateDemande: '25/05/2024',
    statut: 'En attente',
    domaineDns: 'www.univ-ouest.cm',
    dnsVerifie: true,
    adresse: 'Bafoussam - Cameroun',
    email: 'contact@univ-ouest.cm',
    telephone: '+237 6 22 33 44 55',
    decretFichier: 'decret_univ_ouest.pdf',
    decretTaille: '980 Ko',
    signatureFichier: 'signature_legale.p7s',
    signatureTaille: '140 Ko',
    representantLegal: {
      nom: 'Pr. Alice Fomekong',
      fonction: 'Rectrice',
      email: 'rectorat@univ-ouest.cm',
      telephone: '+237 6 22 33 44 55'
    }
  },
  {
    id: 'DEM-2024-0003',
    institution: 'École Supérieure Y',
    type: 'IPES',
    dateDemande: '24/05/2024',
    statut: 'En attente',
    domaineDns: 'www.esy.cm',
    dnsVerifie: false,
    adresse: 'Douala - Cameroun',
    email: 'contact@esy.cm',
    telephone: '+237 6 33 44 55 66',
    decretFichier: 'decret_esy.pdf',
    decretTaille: '1.1 Mo',
    signatureFichier: 'signature_legale.p7s',
    signatureTaille: '130 Ko',
    representantLegal: {
      nom: 'M. Robert Etoa',
      fonction: 'Directeur',
      email: 'direction@esy.cm',
      telephone: '+237 6 33 44 55 66'
    }
  },
  {
    id: 'DEM-2024-0004',
    institution: "Université de l'Est",
    type: 'Université',
    dateDemande: '23/05/2024',
    statut: 'En attente',
    domaineDns: 'www.univ-est.cm',
    dnsVerifie: true,
    adresse: 'Bertoua - Cameroun',
    email: 'contact@univ-est.cm',
    telephone: '+237 6 44 55 66 77',
    decretFichier: 'decret_univ_est.pdf',
    decretTaille: '1.4 Mo',
    signatureFichier: 'signature_legale.p7s',
    signatureTaille: '160 Ko',
    representantLegal: {
      nom: 'Pr. Samuel Biya',
      fonction: 'Recteur',
      email: 'rectorat@univ-est.cm',
      telephone: '+237 6 44 55 66 77'
    }
  },
  {
    id: 'DEM-2024-0005',
    institution: 'Institut Z',
    type: 'IPES',
    dateDemande: '22/05/2024',
    statut: 'En attente',
    domaineDns: 'www.institutz.cm',
    dnsVerifie: true,
    adresse: 'Garoua - Cameroun',
    email: 'contact@institutz.cm',
    telephone: '+237 6 55 66 77 88',
    decretFichier: 'decret_institutz.pdf',
    decretTaille: '900 Ko',
    signatureFichier: 'signature_legale.p7s',
    signatureTaille: '120 Ko',
    representantLegal: {
      nom: 'Mme Christine Manga',
      fonction: 'Directrice',
      email: 'direction@institutz.cm',
      telephone: '+237 6 55 66 77 88'
    }
  },
  {
    id: 'DEM-2024-0006',
    institution: 'Université Nord',
    type: 'Université',
    dateDemande: '20/05/2024',
    statut: 'En attente',
    domaineDns: 'www.univ-nord.cm',
    dnsVerifie: true,
    adresse: 'Maroua - Cameroun',
    email: 'contact@univ-nord.cm',
    telephone: '+237 6 66 77 88 99',
    decretFichier: 'decret_univ_nord.pdf',
    decretTaille: '1.3 Mo',
    signatureFichier: 'signature_legale.p7s',
    signatureTaille: '145 Ko',
    representantLegal: {
      nom: 'Pr. Hamadou Souley',
      fonction: 'Recteur',
      email: 'rectorat@univ-nord.cm',
      telephone: '+237 6 66 77 88 99'
    }
  },
  {
    id: 'DEM-2024-0007',
    institution: 'Institut A',
    type: 'IPES',
    dateDemande: '18/05/2024',
    statut: 'Validée',
    domaineDns: 'www.instituta.cm',
    dnsVerifie: true,
    adresse: 'Yaoundé - Cameroun',
    email: 'contact@instituta.cm',
    telephone: '+237 6 77 88 99 00',
    decretFichier: 'decret_instituta.pdf',
    decretTaille: '1.0 Mo',
    signatureFichier: 'signature_legale.p7s',
    signatureTaille: '135 Ko',
    representantLegal: {
      nom: 'M. Éric Ondoa',
      fonction: 'Directeur Général',
      email: 'direction@instituta.cm',
      telephone: '+237 6 77 88 99 00'
    }
  }
];

// Institutions déjà traitées (validées) uniquement : actives ou suspendues.
// Les demandes "en attente" ne figurent pas ici — voir MOCK_DEMANDES_INSCRIPTION.
export const MOCK_INSTITUTIONS: Institution[] = [
  { id: 'INSTI-2023-0001', nom: 'Université de Yaoundé I', type: 'Université', region: 'Centre', statut: 'Active', dateInscription: '12/01/2023' },
  { id: 'INSTI-2023-0002', nom: 'Université de Douala', type: 'Université', region: 'Littoral', statut: 'Active', dateInscription: '15/01/2023' },
  { id: 'INSTI-2023-0003', nom: 'Université de Buea', type: 'Université', region: 'Sud-Ouest', statut: 'Active', dateInscription: '20/01/2023' },
  { id: 'INSTI-2023-0004', nom: 'Université de Maroua', type: 'Université', region: 'Extrême-Nord', statut: 'Active', dateInscription: '05/01/2023' },
  { id: 'INSTI-2024-0005', nom: 'Institut Z', type: 'IPES', region: 'Nord', statut: 'Suspendue', dateInscription: '10/02/2024' }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { date: '26/05/2024', heure: '14:32', utilisateur: 'Admin UY1', institution: 'Université de Yaoundé I', action: 'Génération de diplômes', details: '1 250 diplômes générés' },
  { date: '26/05/2024', heure: '13:15', utilisateur: 'Admin UDO', institution: 'Université de Douala', action: 'Importation de CSV', details: '850 diplômes importés' },
  { date: '25/05/2024', heure: '11:42', utilisateur: 'Super Admin', institution: 'MINESUP', action: 'Validation Institution', details: 'Université de Buea' },
  { date: '25/05/2024', heure: '18:22', utilisateur: 'Admin UY1', institution: 'Université de Yaoundé I', action: 'Création de design', details: 'Licence Réseaux v1' },
  { date: '25/05/2024', heure: '16:45', utilisateur: 'Système', institution: '-', action: 'Vérification suspecte', details: 'Diplôme CERT-2024-000125' },
  { date: '25/05/2024', heure: '09:10', utilisateur: 'Admin UY1', institution: 'Université de Yaoundé I', action: 'Validation diplômes', details: '1 238 diplômes validés' },
  { date: '25/05/2024', heure: '15:20', utilisateur: 'Super Admin', institution: 'MINESUP', action: 'Révocation diplôme', details: 'CERT-2023-000987' }
];