// EXTRAIT DE ROUTING À FUSIONNER DANS VOTRE app.routes.ts EXISTANT.
// N'écrasez pas vos routes actuelles : ajoutez uniquement ce qui manque.
// Adaptez les chemins d'import (`./pages/...`) à l'arborescence réelle du projet.

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

export const routes: Routes = [
 
  { path: 'institution-registration', component: InstitutionRegistration },
  // { path: 'admin-login', component: AdminLogin }, // remplace l'ancien "login"

  // --- Back-office (layout partagé avec sidebar + topbar) ---
  {
    path: 'admin-layout',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
    //   { path: 'institutions-validees', component: InstitutionsValidees },

      // Flux "Créer des diplômes" : institution-registration → admin-login →
      // dashboard → creer-diplomes → (nouveau-design) → importer →
      // validation-csv → generation → validation-emission
      { path: 'creer-diplomes', component: CreerDiplomes },
      { path: 'creer-diplomes/nouveau-design', component: AiDesignStudio },
      { path: 'creer-diplomes/importer', component: ImporterDiplomes },
      { path: 'creer-diplomes/validation-csv', component: ValidationCsv },
      { path: 'creer-diplomes/generation', component: GenerationDiplomes },
      { path: 'creer-diplomes/validation-emission', component: ValidationEmission },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];