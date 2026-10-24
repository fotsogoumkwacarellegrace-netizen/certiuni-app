
import { Routes } from '@angular/router';

import { InstitutionRegistration } from './module3-admin/institution-registration/institution-registration';
import { AdminLayout } from './module3-admin/admin-layout/admin-layout';
import { Dashboard } from './module3-admin/dashboard/dashboard';
// import { InstitutionsValidees } from './module3-admin/institutions-validees/institutions-validees';
import { CreerDiplomes } from './module3-admin/creer-diplomes/creer-diplomes';
import { AiDesignStudio } from './module3-admin/ai-design-studio/ai-design-studio';
import { ImporterDiplomes } from './module3-admin/importer-diplomes/importer-diplomes';
import { ValidationCsv } from './module3-admin/validation-csv/validation-csv';
import { GenerationDiplomes } from './module3-admin/generation-diplomes/generation-diplomes';
import { ValidationEmission } from './module3-admin/validation-emission/validation-emission';
import { DiplomesEmis } from './module3-admin/diplomes-emis/diplomes-emis';
import { VoirDiplome } from './module3-admin/voir-diplome/voir-diplome';
import { RevoquerDiplome } from './module3-admin/revoquer-diplome/revoquer-diplome';

import { LogsVerification } from './module3-admin/logs-verification/logs-verification';
import { MonInstitution } from './module3-admin/mon-institution/mon-institution';
import { Parametres } from './module3-admin/parametres/parametres';


import { AdminLogin } from './module3-admin/admin-login/admin-login';


export const routes: Routes = [
  { path: '', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: 'institution-registration', component: InstitutionRegistration },
  { path: 'admin-login', component: AdminLogin },   // ← cette ligne manquait
  {
  path: 'admin',
  component: AdminLayout,
  children: [
    { path: 'dashboard', component: Dashboard },
    
    { path: 'creer-diplomes', component: CreerDiplomes },
    { path: 'creer-diplomes/nouveau-design', component: AiDesignStudio },
    { path: 'creer-diplomes/importer', component: ImporterDiplomes },
    { path: 'creer-diplomes/validation-csv', component: ValidationCsv },
    { path: 'creer-diplomes/generation', component: GenerationDiplomes },
    { path: 'creer-diplomes/validation-emission', component: ValidationEmission },
    { path: 'diplomes-emis', component: DiplomesEmis },
     { path: 'diplomes-emis/:id', component: VoirDiplome },
      { path: 'diplomes-emis/:id/revoquer', component: RevoquerDiplome },
    { path: 'logs-verification', component: LogsVerification },
    { path: 'mon-institution', component: MonInstitution },
    { path: 'parametres', component: Parametres },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},


];