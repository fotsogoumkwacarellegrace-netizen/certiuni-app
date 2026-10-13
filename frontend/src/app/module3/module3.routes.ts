import { Routes } from '@angular/router';

import { Login } from './student-pages/login/login';
import { Dashboard } from './student-pages/dashboard/dashboard';
import { Archive } from './student-pages/archive/archive';

export const module3Routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'archive', component: Archive },
];