import { Routes } from '@angular/router';

import { AdminLayout } from './admin-layout/admin-layout';
import { InstitutionRegistration } from './institution-registration/institution-registration';
import { AdminLogin } from './admin-login/admin-login';
import { Dashboard } from './dashboard/dashboard';
import { CreerDiplomes } from './creer-diplomes/creer-diplomes';
import { AiDesignStudio } from './ai-design-studio/ai-design-studio';
import { ImporterDiplomes } from './importer-diplomes/importer-diplomes';
import { ValidationCsv } from './validation-csv/validation-csv';
import { GenerationDiplomes } from './generation-diplomes/generation-diplomes';
import { ValidationEmission } from './validation-emission/validation-emission';
import { DiplomesEmis } from './diplomes-emis/diplomes-emis';
import { VoirDiplome } from './voir-diplome/voir-diplome';
import { RevoquerDiplome } from './revoquer-diplome/revoquer-diplome';
import { LogsVerification } from './logs-verification/logs-verification';
import { MonInstitution } from './mon-institution/mon-institution';
import { ChangerLogo } from './mon-institution/changer-logo/changer-logo';
import { Parametres } from './parametres/parametres';

// Montées sous le prefix /admin dans app.routes.ts
export const ADMIN_ROUTES: Routes = [
  { path: 'login', component: AdminLogin },
  { path: 'inscription', component: InstitutionRegistration },
  // Page « en preparation » hors layout : plein ecran, sans sidebar/navbar.
  {
    path: 'bientot',
    loadComponent: () =>
      import('../shared/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: Dashboard },

      // Flux "Créer des diplômes"
      { path: 'creer-diplomes', component: CreerDiplomes },
      { path: 'creer-diplomes/nouveau-design', component: AiDesignStudio },
      { path: 'creer-diplomes/importer', component: ImporterDiplomes },
      { path: 'creer-diplomes/validation-csv', component: ValidationCsv },
      { path: 'creer-diplomes/generation', component: GenerationDiplomes },
      { path: 'creer-diplomes/validation-emission', component: ValidationEmission },

      // Diplômes émis
      { path: 'diplomes-emis', component: DiplomesEmis },
      { path: 'diplomes-emis/:id', component: VoirDiplome },
      { path: 'diplomes-emis/:id/revoquer', component: RevoquerDiplome },

      // Supervision
      { path: 'logs-verification', component: LogsVerification },
      { path: 'mon-institution', component: MonInstitution },
      { path: 'mon-institution/changer-logo', component: ChangerLogo },
      { path: 'parametres', component: Parametres },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
