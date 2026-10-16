// src/app/services/i18n.service.ts
import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'FR' | 'EN';

const STORAGE_KEY = 'certiuni_lang';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  FR: {
    // ===== Marque =====
    brandTagline: 'Diplômes sûrs, avenir sûr',
    portalVerifier: 'Portail vérificateur',

    // ===== Navigation sidebar =====
    navVerification: 'Vérification',
    navSpace: 'Espace',
    accueil: 'Accueil',
    scan: 'Scanner QR',
    ocr: 'Analyse de document',
    lot: 'Vérification par lot',
    history: 'Historique',
    settings: 'Paramètres',
    soon: 'Bientôt',
    
    credits: 'Crédits & forfaits',
    walletTitle: 'Voir mon solde de vérifications',
    walletFree: 'gratuites',
    walletCredits: 'crédits',
    walletAvailable: 'Solde disponible',
    // ===== Topbar =====
    newVerif: 'Nouvelle vérification',
    registry: 'Registre en ligne',
    searchPh: 'Vérifier un identifiant (UUID)…',
    searching: 'Recherche…',
    verify: 'Vérifier',
    notifications: 'Notifications',
    markAll: 'Tout marquer comme lu',
    noNotif: 'Aucune notification',
    language: 'Langue',
    theme: 'Changer le thème',
    myAccount: 'Mon compte',
    help: 'Aide & support',
    logout: 'Déconnexion',
    login: 'Se connecter',
    recruiter: 'Recruteur',
    publicMode: 'Mode public',
    guest: 'Invité',
    secure: 'Session sécurisée',
    sha: 'Empreinte SHA-256 active',
    breadcrumb: "Fil d'Ariane",
    collapse: 'Replier le menu',
    expand: 'Déplier le menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    soonMsg: 'fonctionnalité bientôt disponible.',
    loggedOut: 'Vous avez été déconnecté.',
    langChanged: 'Langue : Français',
    portal: 'Portail',

    // ===== Landing =====
    landingLogin: 'Se connecter',
    landingVerify: 'Vérifier un diplôme',
    landingHeroTitle: 'Vérifiez vos diplômes avec une confiance absolue.',
    landingHeroSubtitle:
      "CertiUni centralise l'émission, la notarisation et la vérification des diplômes universitaires camerounais. Authentifiez un document en quelques secondes, sans intermédiaire.",
    landingFeatures: 'Voir les fonctionnalités',
    landingNavHome: 'Accueil',
    landingNavFeatures: 'Fonctionnalités',
    landingNavPricing: 'Tarifs',
    landingNavResources: 'Ressources',
    landingNavAbout: 'À propos',

    // ===== Login =====
    loginTitle: 'Connexion',
    loginNoAccount: 'Pas encore de compte ?',
    loginCreateAccount: 'Créer un compte',
    loginEmail: 'Adresse email',
    loginPassword: 'Mot de passe',
    loginRemember: 'Se souvenir de moi',
    loginForgot: 'Mot de passe oublié ?',
    loginSubmit: 'Se connecter',
    loginSubmitting: 'Connexion en cours...',
    loginBack: 'Retour au site',
    loginVerifyNoAccount: 'Vérifier un diplôme sans compte',
    loginDemoText: 'Prototype : testez avec le compte de démonstration.',
    loginDemoFill: 'Remplir',
    loginHeroTitle: 'Chaque diplôme mérite sa preuve.',
    loginHeroSubtitle:
      'Un QR code, une empreinte SHA-256, un verdict sans ambiguïté : authentifiez un titre universitaire en quelques secondes.',
    loginOrEmail: 'ou avec votre email',

    // ===== Verdicts =====
    verdictValidTitle: 'Document authentique',
    verdictValidText:
      'Diplôme authentifié. Vous pouvez maintenant télécharger le PDF certifié avec cachet VÉRIFIÉ · CertiUni.',
    verdictValidDownload: 'Télécharger le diplôme certifié',
    verdictNewVerif: 'Nouvelle vérification',
    verdictViewHistory: "Voir l'historique",
    verdictHolder: 'Titulaire du diplôme',
    verdictYear: 'Année académique',
    verdictInstitution: 'Établissement accrédité',
    verdictAttestation: "Attestation Numérique d'État",
    verdictVerified: 'Diplôme Vérifié',

    verdictRevokedTitle: 'Document révoqué',
    verdictRevokedText:
      "Ce diplôme n'est plus valide. Il a été officiellement annulé par l'établissement émetteur et ne peut plus être utilisé comme preuve d'authenticité.",
    verdictRevokedPill: 'Diplôme Révoqué',
    verdictRevokedRef: 'Référence document',
    verdictRevokedStatus: 'Statut',
    verdictRevokedReason: 'Motif de révocation',
    verdictRevokedContact: 'Contacter le Secrétariat Émetteur',
    verdictRevokedLocked:
      'Les données nominatives de ce document sont verrouillées par mesure de sécurité.',

    verdictUnknownTitle: 'Document non identifié',
    verdictUnknownText:
      "Aucune correspondance n'a été trouvée dans le registre national pour l'identifiant",
    verdictUnknownSchool: 'École non partenaire',
    verdictUnknownInstitution: 'Établissement',
    verdictUnknownInstitute: 'Institut Supérieur X',
    verdictUnknownProtocol: "N'utilise pas encore le protocole CertiUni",
    verdictUnknownSearchId: 'Identifiant recherché',
    verdictUnknownStatus: 'Introuvable',
    verdictUnknownGuarantee: 'Réponse garantie sous 48 heures',
    verdictUnknownGuaranteeText:
      "Notre équipe peut authentifier manuellement ce document si l'établissement n'est pas encore intégré à CertiUni.",
    verdictUnknownManual: 'Lancer une vérification manuelle',
    verdictUnknownWhat: 'Que faire ?',
    verdictUnknownStep1: "Vérifiez l'identifiant",
    verdictUnknownStep1Desc: 'Assurez-vous que le code saisi est correct et complet',
    verdictUnknownStep2: "Contactez l'établissement",
    verdictUnknownStep2Desc: "Certaines écoles peuvent ne pas être encore intégrées",
    verdictUnknownStep3: 'Vérification manuelle',
    verdictUnknownStep3Desc: 'Notre équipe peut authentifier le document sous 48h',
    verdictUnknownTrust1: 'SHA-256',
    verdictUnknownTrust2: 'Source officielle',

    // ===== Bulk upload =====
    bulkTitle: 'Vérification par Lot',
    bulkSubtitle:
      "Analysez simultanément plusieurs diplômes à partir d'un fichier CSV ou JSON",
    bulkBadge: 'Recrutement de Masse',
    bulkHeading: 'Vérifiez des centaines de candidats en une seule opération',
    bulkDescription:
      "Rationalisez votre processus d'embauche en vérifiant des dossiers de candidats à la fois dans le registre national. Sécurisé, basé sur API et entièrement conforme.",
    bulkCsvSupport: '.CSV Supporté',
    bulkJsonSupport: '.JSON Supporté',
    bulkStep1: 'Déposez votre fichier de candidats',
    bulkStep2: 'Notre système analyse chaque diplôme',
    bulkStep3: 'Consultez le rapport détaillé',
    bulkDropTitle: 'Glissez & Déposez vos fichiers',
    bulkDropHint: 'ou',
    bulkDropBrowse: 'cliquez pour parcourir le stockage local',
    bulkProcessing: 'Analyse du fichier en cours...',
    bulkDone: 'Analyse terminée !',
    bulkCandidates: 'candidats traités',
    bulkValid: 'Validés',
    bulkRevoked: 'Révoqués',
    bulkUnknown: 'Inconnus',
    bulkReset: 'Analyser un autre fichier',
    bulkViewResults: 'Voir les résultats',

    // ===== Bulk table =====
    tableTitle: 'Rapport de Vérification en Masse',
    tableSubtitle: 'Vérification groupée -',
    tableSubtitle2: 'candidats analysés',
    tableBack: 'Nouvelle analyse groupée',
    tableExport: 'Exporter le Rapport final',
    tableExporting: 'Export en cours...',
    tableSearchPh: 'Rechercher par nom, ID ou diplôme...',
    tableAll: 'Tous',
    tableValidated: 'Validés',
    tableRevoked: 'Révoqués',
    tableUnknown: 'Inconnus',
    tableUuid: 'UUID CANDIDAT',
    tableName: 'NOM EXTRAIT',
    tableDiploma: 'DIPLÔME DÉTECTÉ',
    tableStatus: 'STATUT DE CONFORMITÉ',
    tableActions: 'ACTIONS',
    tableNoResult: 'Aucun résultat trouvé',
    tableNoResultDesc: 'Essayez d\'ajuster vos critères de recherche ou de filtrage',
    tableShowing: 'Affichage de',
    tableTo: 'à',
    tableOf: 'sur',
    tableResults: 'résultats',
    tableStatusValid: 'Validé',
    tableStatusRevoked: 'Révoqué',
    tableStatusUnknown: 'Inconnu',
    tableLoading: 'Chargement des informations...',
    tableAuth: 'Certificat Authentique',
    tableSignature: 'Signature cryptographique validée ·',
    tableAcademic: 'Données académiques',
    tableInstitution: 'Institution',
    tableDiplomaLabel: 'Diplôme',
    tableMention: 'Mention',
    tableAverage: 'Moyenne générale',
    tableGrades: 'Relevé détaillé',
    tableCredits: 'crédits',
    tableSubject: 'Matière',
    tableGrade: 'Note',
    tableCreditsCol: 'Crédits',
    tableHash: 'Empreinte SHA-256',
    tableViewOriginal: 'Voir le Diplôme Original',
    tableRevokedTitle: 'Diplôme Révoqué',
    tableUnknownTitle: 'Document Introuvable',

    // ===== Settings =====
    settingsTitle: 'Paramètres',
    settingsSubtitle: 'Gérez la configuration de votre plateforme CertiUni',
    settingsGeneral: 'Général',
    settingsInstitution: 'Institution',
    settingsSecurity: 'Sécurité',
    settingsBilling: 'Facturation',
    settingsAi: 'Intelligence Artificielle',
    settingsNotifications: 'Notifications',
    settingsApi: 'API & Intégrations',
    settingsAbout: 'À propos',
    settingsBack: 'Retour',
    settingsSave: 'Enregistrer',
    settingsReset: 'Réinitialiser',

    // ===== Common =====
    commonClose: 'Fermer',
    commonCancel: 'Annuler',
    commonConfirm: 'Confirmer',
    commonLoading: 'Chargement...'

    
  },
  EN: {
    // ===== Brand =====
    brandTagline: 'Safe diplomas, secure future',
    portalVerifier: 'Verifier portal',

    // ===== Navigation sidebar =====
    navVerification: 'Verification',
    navSpace: 'Workspace',
    accueil: 'Home',
    scan: 'Scan QR',
    ocr: 'Document analysis',
    lot: 'Bulk verification',
    history: 'History',
    settings: 'Settings',
    soon: 'Soon',
    
    credits: 'Credits & plans',
    walletTitle: 'View my verification balance',
    walletFree: 'free',
    walletCredits: 'credits',
    walletAvailable: 'Available balance',
    // ===== Topbar =====
    newVerif: 'New verification',
    registry: 'Live registry',
    searchPh: 'Verify an identifier (UUID)…',
    searching: 'Searching…',
    verify: 'Verify',
    notifications: 'Notifications',
    markAll: 'Mark all as read',
    noNotif: 'No notifications',
    language: 'Language',
    theme: 'Toggle theme',
    myAccount: 'My account',
    help: 'Help & support',
    logout: 'Log out',
    login: 'Sign in',
    recruiter: 'Recruiter',
    publicMode: 'Public mode',
    guest: 'Guest',
    secure: 'Secure session',
    sha: 'SHA-256 fingerprint active',
    breadcrumb: 'Breadcrumb',
    collapse: 'Collapse menu',
    expand: 'Expand menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    soonMsg: 'feature coming soon.',
    loggedOut: 'You have been signed out.',
    langChanged: 'Language: English',
    portal: 'Portal',

    // ===== Landing =====
    landingLogin: 'Sign in',
    landingVerify: 'Verify a diploma',
    landingHeroTitle: 'Verify your diplomas with absolute confidence.',
    landingHeroSubtitle:
      'CertiUni centralizes the issuance, notarization and verification of Cameroonian university diplomas. Authenticate a document in seconds, without intermediaries.',
    landingFeatures: 'See features',
    landingNavHome: 'Home',
    landingNavFeatures: 'Features',
    landingNavPricing: 'Pricing',
    landingNavResources: 'Resources',
    landingNavAbout: 'About',

    // ===== Login =====
    loginTitle: 'Sign in',
    loginNoAccount: 'No account yet?',
    loginCreateAccount: 'Create an account',
    loginEmail: 'Email address',
    loginPassword: 'Password',
    loginRemember: 'Remember me',
    loginForgot: 'Forgot password?',
    loginSubmit: 'Sign in',
    loginSubmitting: 'Signing in...',
    loginBack: 'Back to site',
    loginVerifyNoAccount: 'Verify a diploma without an account',
    loginDemoText: 'Prototype: try the demo account.',
    loginDemoFill: 'Fill',
    loginHeroTitle: 'Every diploma deserves its proof.',
    loginHeroSubtitle:
      'A QR code, a SHA-256 fingerprint, an unambiguous verdict: authenticate a university degree in seconds.',
    loginOrEmail: 'or with your email',

    // ===== Verdicts =====
    verdictValidTitle: 'Authentic document',
    verdictValidText:
      'Diploma authenticated. You can now download the certified PDF with the VERIFIED · CertiUni stamp.',
    verdictValidDownload: 'Download certified diploma',
    verdictNewVerif: 'New verification',
    verdictViewHistory: 'View history',
    verdictHolder: 'Diploma holder',
    verdictYear: 'Academic year',
    verdictInstitution: 'Accredited institution',
    verdictAttestation: 'State Digital Attestation',
    verdictVerified: 'Verified Diploma',

    verdictRevokedTitle: 'Revoked document',
    verdictRevokedText:
      'This diploma is no longer valid. It was officially revoked by the issuing institution and can no longer be used as proof of authenticity.',
    verdictRevokedPill: 'Revoked Diploma',
    verdictRevokedRef: 'Document reference',
    verdictRevokedStatus: 'Status',
    verdictRevokedReason: 'Revocation reason',
    verdictRevokedContact: 'Contact the Issuing Secretariat',
    verdictRevokedLocked:
      'Personal data in this document is locked for security reasons.',

    verdictUnknownTitle: 'Unidentified document',
    verdictUnknownText:
      'No match was found in the national registry for the identifier',
    verdictUnknownSchool: 'Non-partner school',
    verdictUnknownInstitution: 'Institution',
    verdictUnknownInstitute: 'Higher Institute X',
    verdictUnknownProtocol: 'Does not use the CertiUni protocol yet',
    verdictUnknownSearchId: 'Searched identifier',
    verdictUnknownStatus: 'Not found',
    verdictUnknownGuarantee: 'Guaranteed response within 48 hours',
    verdictUnknownGuaranteeText:
      'Our team can manually authenticate this document if the institution is not yet integrated into CertiUni.',
    verdictUnknownManual: 'Start a manual verification',
    verdictUnknownWhat: 'What to do?',
    verdictUnknownStep1: 'Check the identifier',
    verdictUnknownStep1Desc: 'Make sure the entered code is correct and complete',
    verdictUnknownStep2: 'Contact the institution',
    verdictUnknownStep2Desc: 'Some schools may not be integrated yet',
    verdictUnknownStep3: 'Manual verification',
    verdictUnknownStep3Desc: 'Our team can authenticate the document within 48h',
    verdictUnknownTrust1: 'SHA-256',
    verdictUnknownTrust2: 'Official source',

    // ===== Bulk upload =====
    bulkTitle: 'Bulk Verification',
    bulkSubtitle: 'Analyze multiple diplomas simultaneously from a CSV or JSON file',
    bulkBadge: 'Mass Recruitment',
    bulkHeading: 'Verify hundreds of candidates in a single operation',
    bulkDescription:
      'Streamline your hiring process by verifying candidate files against the national registry. Secure, API-based and fully compliant.',
    bulkCsvSupport: '.CSV Supported',
    bulkJsonSupport: '.JSON Supported',
    bulkStep1: 'Drop your candidate file',
    bulkStep2: 'Our system analyzes each diploma',
    bulkStep3: 'View the detailed report',
    bulkDropTitle: 'Drag & Drop your files',
    bulkDropHint: 'or',
    bulkDropBrowse: 'click to browse local storage',
    bulkProcessing: 'Analyzing file...',
    bulkDone: 'Analysis complete!',
    bulkCandidates: 'candidates processed',
    bulkValid: 'Valid',
    bulkRevoked: 'Revoked',
    bulkUnknown: 'Unknown',
    bulkReset: 'Analyze another file',
    bulkViewResults: 'View results',

    // ===== Bulk table =====
    tableTitle: 'Bulk Verification Report',
    tableSubtitle: 'Bulk verification -',
    tableSubtitle2: 'candidates analyzed',
    tableBack: 'New bulk analysis',
    tableExport: 'Export final report',
    tableExporting: 'Exporting...',
    tableSearchPh: 'Search by name, ID or diploma...',
    tableAll: 'All',
    tableValidated: 'Validated',
    tableRevoked: 'Revoked',
    tableUnknown: 'Unknown',
    tableUuid: 'CANDIDATE UUID',
    tableName: 'EXTRACTED NAME',
    tableDiploma: 'DETECTED DIPLOMA',
    tableStatus: 'COMPLIANCE STATUS',
    tableActions: 'ACTIONS',
    tableNoResult: 'No results found',
    tableNoResultDesc: 'Try adjusting your search or filter criteria',
    tableShowing: 'Showing',
    tableTo: 'to',
    tableOf: 'of',
    tableResults: 'results',
    tableStatusValid: 'Valid',
    tableStatusRevoked: 'Revoked',
    tableStatusUnknown: 'Unknown',
    tableLoading: 'Loading information...',
    tableAuth: 'Authentic Certificate',
    tableSignature: 'Cryptographic signature validated ·',
    tableAcademic: 'Academic data',
    tableInstitution: 'Institution',
    tableDiplomaLabel: 'Diploma',
    tableMention: 'Honors',
    tableAverage: 'Overall average',
    tableGrades: 'Detailed transcript',
    tableCredits: 'credits',
    tableSubject: 'Subject',
    tableGrade: 'Grade',
    tableCreditsCol: 'Credits',
    tableHash: 'SHA-256 fingerprint',
    tableViewOriginal: 'View Original Diploma',
    tableRevokedTitle: 'Revoked Diploma',
    tableUnknownTitle: 'Document Not Found',

    // ===== Settings =====
    settingsTitle: 'Settings',
    settingsSubtitle: 'Manage your CertiUni platform configuration',
    settingsGeneral: 'General',
    settingsInstitution: 'Institution',
    settingsSecurity: 'Security',
    settingsBilling: 'Billing',
    settingsAi: 'Artificial Intelligence',
    settingsNotifications: 'Notifications',
    settingsApi: 'API & Integrations',
    settingsAbout: 'About',
    settingsBack: 'Back',
    settingsSave: 'Save',
    settingsReset: 'Reset',

    // ===== Common =====
    commonClose: 'Close',
    commonCancel: 'Cancel',
    commonConfirm: 'Confirm',
    commonLoading: 'Loading...'
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly _lang = signal<Lang>(this.readStoredLang());

  readonly lang = this._lang.asReadonly();
  readonly isFr = computed(() => this._lang() === 'FR');

  constructor() {
    this.applyDocumentLang(this._lang());
  }

  setLang(lang: Lang): void {
    this._lang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.applyDocumentLang(lang);
  }

  toggleLang(): void {
    this.setLang(this._lang() === 'FR' ? 'EN' : 'FR');
  }

  /** Traduit une clé. Retourne la clé elle-même si introuvable. */
  t(key: string): string {
    return TRANSLATIONS[this._lang()][key] ?? TRANSLATIONS.FR[key] ?? key;
  }

  private readStoredLang(): Lang {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'EN' ? 'EN' : 'FR';
  }

  private applyDocumentLang(lang: Lang): void {
    document.documentElement.lang = lang.toLowerCase();
  }
}