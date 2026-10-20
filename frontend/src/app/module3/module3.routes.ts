import { Routes } from '@angular/router';

import { Login } from './student-pages/login/login';
import { Dashboard } from './student-pages/dashboard/dashboard';
import { Archive } from './student-pages/archive/archive';
import { StudentHelp } from './student-pages/student-help/student-help';

// Montées sous le prefix /student dans app.routes.ts
export const module3Routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'archive', component: Archive },
  // Page d'aide plein ecran (sans sidebar / navbar du dashboard)
  { path: 'help', component: StudentHelp },
  {
    path: 'bientot',
    loadComponent: () =>
      import('../shared/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
];
