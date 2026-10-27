import { Routes } from '@angular/router';

import { SuperadminLayout } from './superadmin-layout/superadmin-layout';
import { SuperadminLogin } from './superadmin-login/superadmin-login';
import { DashboardSuperadmin } from './dashboard-superadmin/dashboard-superadmin';
import { DemandesInscription } from './demandes-inscription/demandes-inscription';
import { ConsulterDemande } from './consulter-demande/consulter-demande';
import { InstitutionsSuperadmin } from './institutions-superadmin/institutions-superadmin';
import { Audit } from './audit/audit';
import { ParametresSuperadmin } from './parametres-superadmin/parametres-superadmin';

// Montées sous le prefix /superadmin dans app.routes.ts.
// Le login (/superadmin-login) est déclaré directement dans app.routes.ts.
export const superadminRoutes: Routes = [
  { path: 'login', component: SuperadminLogin },
  // Page « en preparation » hors layout : plein ecran, sans sidebar/navbar.
  {
    path: 'bientot',
    loadComponent: () =>
      import('../shared/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: '',
    component: SuperadminLayout,
    children: [
      { path: 'dashboard', component: DashboardSuperadmin },
      { path: 'demandes-inscription', component: DemandesInscription },
      { path: 'demandes-inscription/:id', component: ConsulterDemande },
      { path: 'institutions', component: InstitutionsSuperadmin },
      { path: 'audit', component: Audit },
      { path: 'parametres', component: ParametresSuperadmin },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
