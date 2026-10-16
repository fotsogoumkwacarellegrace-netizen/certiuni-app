// src/app/module1/landing/landing.data.ts
import { CreditPack, UNIT_PRICE, FREE_PER_MONTH, CREDIT_PACKS } from '../../services/billing.service';

export interface NavItem { label: string; target: string; }
export interface Feature { icon: string; title: string; text: string; }
export interface IconLine { icon: string; text: string; }
export interface InspectorRow { icon: string; name: string; meta: string; badge: string; }
export interface AuditEvent {
  tone: 'ok' | 'danger' | 'neutral';
  icon: string;
  title: string;
  meta: string;
  status: string;
  time: string;
}
export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  unit?: string;
  features: string[];
  cta: string;
  featured?: boolean;
  action: 'verify' | 'login' | 'contact';
}
export interface RecruiterPack {
  id: string;
  name: string;
  credits: number;
  price: string;
  perUnit: string;
  savings: number;
  featured?: boolean;
}
export interface FaqItem { q: string; a: string; }
export interface FooterLink { label: string; route?: string; section?: string; }
export interface FooterColumn { title: string; links: FooterLink[]; }

const fcfa = (value: number): string => new Intl.NumberFormat('fr-FR').format(value);

export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', target: 'accueil' },
  { label: 'Fonctionnalités', target: 'fonctionnalites' },
  { label: 'Tarifs', target: 'tarifs' },
  { label: 'Ressources', target: 'faq' },
  { label: 'À propos', target: 'a-propos' }
];

export const HERO_TRUST: string[] = [
  `${FREE_PER_MONTH} vérifications gratuites par mois`,
  'Empreinte SHA-256',
  'Vérification en ligne instantanée'
];

export const FEATURES: Feature[] = [
  {
    icon: 'speed',
    title: 'Vérification instantanée',
    text: 'Saisissez un identifiant unique ou scannez le QR code pour obtenir un verdict clair et vérifiable (valide, révoqué ou introuvable) en quelques secondes.'
  },
  {
    icon: 'manage_search',
    title: 'Inspection documentaire & Métadonnées',
    text: "Contrôle automatique de l'intégrité du document et confrontation instantanée avec le registre CertiUni des diplômes certifiés."
  },
  {
    icon: 'stacks',
    title: 'Vérification en masse',
    text: 'Importez un tableur Excel contenant 100+ dossiers ou CV et recevez en un clic le rapport consolidé des titres authentifiés.'
  },
  {
    icon: 'lock_reset',
    title: 'Émission sécurisée',
    text: 'Générez des PDF protégés avec QR code dynamique, filigrane CertiUni et empreinte SHA-256 unique pour chaque diplôme.'
  },
  {
    icon: 'verified_user',
    title: 'Validation de conformité cryptographique',
    text: 'Vérification stricte des matricules, cursus, scellés numériques et empreintes SHA-256 avant toute publication.'
  },
  {
    icon: 'shield',
    title: 'Données protégées',
    text: "Isolation stricte entre établissements, hébergement chiffré et architecture pensée pour le respect de la réglementation camerounaise de protection des données."
  }
];

export const IMPORT_CHECKLIST: string[] = [
  'Importation instantanée de fichiers Excel ou CSV de la promotion',
  'Contrôle rigoureux des métadonnées et des notes',
  'Génération en masse des PDF sécurisés avec QR code et filigrane CertiUni',
  'Suivi des émissions et des consultations en direct'
];

export const IMPORT_STEPS: string[] = ['1. Import', '2. Contrôle', '3. Correction', '4. Émission'];

export const SECURITY_LINES: IconLine[] = [
  { icon: 'content_paste_search', text: 'Détection rigoureuse des doublons et anomalies matriculaires' },
  { icon: 'qr_code_2', text: 'QR code dynamique et empreinte SHA-256 de chaque document' },
  { icon: 'security', text: 'Alerte instantanée en cas de tentative de modification de données' },
  { icon: 'draw', text: 'Gabarits normalisés pour chaque filière' }
];

export const INSPECTOR_ROWS: InspectorRow[] = [
  { icon: 'check_circle', name: 'EXEMPLE Aline', meta: 'Licence Info • Matricule : 24A001FS', badge: 'Validé' },
  { icon: 'verified', name: 'EXEMPLE Boris', meta: 'Master Gestion • Cursus & crédits validés', badge: 'Conforme' },
  { icon: 'fingerprint', name: 'EXEMPLE Carine', meta: 'Licence Droit • Empreinte SHA-256 générée', badge: 'Scellé' }
];

export const AUDIT_LINES: IconLine[] = [
  { icon: 'pin_drop', text: 'Tableau de bord des scans avec géolocalisation des requêtes' },
  { icon: 'notifications_active', text: 'Alertes de sécurité instantanées en cas de tentative frauduleuse' },
  { icon: 'key', text: 'Historique et révocation avec double authentification MFA' },
  { icon: 'receipt_long', text: 'Notifications par email et reçus de consultation horodatés' }
];

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    tone: 'ok',
    icon: 'verified',
    title: 'Vérification réussie • Yaoundé',
    meta: "Diplôme d'Ingénieur • IP : 102.244.xx",
    status: 'Valide',
    time: 'il y a 2 min'
  },
  {
    tone: 'danger',
    icon: 'block',
    title: 'Diplôme révoqué • Douala',
    meta: 'Motif : annulation session 2024',
    status: 'Révoqué',
    time: 'il y a 14 min'
  },
  {
    tone: 'neutral',
    icon: 'help_outline',
    title: 'Clé inconnue • Bafoussam',
    meta: 'Identifiant #CMR-9923 absent du registre',
    status: 'Inconnu',
    time: 'il y a 32 min'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'recruteur',
    name: 'Recruteur',
    tagline: 'Pour vérifier à votre rythme',
    price: 'Gratuit',
    unit: `${FREE_PER_MONTH} vérifications / mois`,
    features: [
      `${FREE_PER_MONTH} vérifications gratuites chaque mois`,
      `Ensuite ${fcfa(UNIT_PRICE)} FCFA l’unité, dès ${fcfa(
        Math.round(CREDIT_PACKS[2].price / CREDIT_PACKS[2].credits)
      )} FCFA en pack`,
      'Packs 10 et 50 prépayés, sans abonnement',
      'Facturé uniquement si le verdict est Valide ou Révoqué',
      'Paiement MTN MoMo & Orange Money'
    ],
    cta: 'Vérifier un diplôme',
    action: 'verify'
  },
  {
    id: 'etudiant',
    name: 'Étudiant & Diplômé',
    tagline: 'Pour débloquer son diplôme',
    price: '1 000 FCFA',
    unit: '/ diplôme',
    features: [
      'Portefeuille numérique sécurisé',
      'Copie conforme filigranée PDF',
      'Reçu de paiement électronique',
      'MTN MoMo, Orange Money & CB',
      'Partage sur LinkedIn'
    ],
    cta: 'Débloquer mon diplôme',
    featured: true,
    action: 'login'
  },
  {
    id: 'universite',
    name: 'Université',
    tagline: 'Pour émettre et gérer',
    price: 'Abonnement',
    features: [
      'Mode Sandbox test gratuit',
      'Import Excel / CSV (jusqu’à 50 Mo)',
      'Studio de gabarits de diplômes',
      'Contrôle qualité automatisé',
      'Tableau de bord & Révocation MFA'
    ],
    cta: 'Inscrire mon établissement',
    action: 'login'
  },
  {
    id: 'entreprise',
    name: 'Entreprise & RH',
    tagline: 'Pour les RH et institutions',
    price: 'Sur devis',
    features: [
      'Vérification en masse (100+ CV)',
      'Rapports de vérification exportables',
      'Accès API REST',
      'Support dédié, niveau de service sur mesure'
    ],
    cta: "Contacter l'équipe",
    action: 'contact'
  }
];

/** Packs prépayés affichés sous la grille des tarifs (source : BillingService). */
export const FREE_MONTHLY = FREE_PER_MONTH;

export const RECRUITER_PACKS: RecruiterPack[] = CREDIT_PACKS.map((pack) => ({
  id: pack.id,
  name: pack.credits === 1 ? 'À l’unité' : `Pack ${pack.credits}`,
  credits: pack.credits,
  price: fcfa(pack.price),
  perUnit: fcfa(Math.round(pack.price / pack.credits)),
  savings: Math.round((1 - pack.price / (pack.credits * UNIT_PRICE)) * 100),
  featured: pack.featured
}));

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Dois-je payer pour vérifier un diplôme ?',
    a: `Chaque mois, vos ${FREE_PER_MONTH} premières vérifications sont gratuites. Ensuite, une vérification coûte ${fcfa(
      UNIT_PRICE
    )} FCFA à l'unité, ou moins avec les packs de 10 et de 50 crédits. Vous n'êtes facturé que si le verdict est Valide ou Révoqué : un diplôme introuvable ne vous coûte rien.`
  },
  {
    q: 'Comment fonctionnent les crédits ?',
    a: "Les crédits sont prépayés par MTN MoMo ou Orange Money, sans abonnement ni prélèvement automatique. Ils n'expirent pas et sont utilisés après vos vérifications gratuites du mois."
  },
  {
    q: "Que se passe-t-il si mon établissement n'est pas encore partenaire ?",
    a: "Vous pouvez soumettre une demande de vérification manuelle pour 2 000 FCFA. Notre équipe contacte directement le secrétariat ou la direction académique concernée afin d'authentifier le document sous 48 heures."
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: "Vos données sont chiffrées, isolées par établissement et hébergées de manière sécurisée. CertiUni ne les partage pas avec des tiers et vise la conformité avec la réglementation camerounaise de protection des données."
  }
];

export const CTA_POINTS: string[] = ['Sandbox gratuit', 'Support dédié', 'Données chiffrées'];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Produit',
    links: [
      { label: 'Portail Vérificateur', route: '/public/accueil' },
      { label: 'Sceau Numérique Sécurisé', section: 'securite' },
      { label: 'Établissements & Tarifs', section: 'tarifs' },
      { label: 'API Entreprises' },
      { label: 'Registre CertiUni' }
    ]
  },
  {
    title: 'Ressources',
    links: [
      { label: "Guides d'authentification" },
      { label: 'Espace Étudiant / Diplômé', route: '/public/login' },
      { label: 'Pour les établissements', section: 'gestion' },
      { label: 'Foire Aux Questions', section: 'faq' },
      { label: 'Nous contacter' }
    ]
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos de CertiUni', section: 'a-propos' },
      { label: 'Notre approche', section: 'securite' },
      { label: 'Recruteurs & Institutions' },
      { label: 'Presse & Communiqués' }
    ]
  },
  {
    title: 'Légal',
    links: [
      { label: "Conditions d'utilisation" },
      { label: 'Données Personnelles' },
      { label: 'Mentions légales' },
      { label: 'Normes Cryptographiques' }
    ]
  }
];