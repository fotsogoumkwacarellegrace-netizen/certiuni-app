
import { Routes } from '@angular/router';

/**
 * Routes racines de l'application unifiée CertiUni.
 *
 * /public/*     -> Module 1 : portail public
 * /student/*    -> Module 3 : espace étudiant
 * /admin/*      -> Module 3 : back-office institution
 * /superadmin/* -> Module 4 : superadmin
 */
export const routes: Routes = [
  // Racine -> portail public
  {
    path: '',
    redirectTo: 'public/landing',
    pathMatch: 'full',
  },

  // Module 1 : portail public
  {
    path: 'public',
    loadChildren: () =>
      import('./module1/module1.routes').then((m) => m.MODULE1_ROUTES),
  },

  // Module 3 : espace étudiant
  {
    path: 'student',
    loadChildren: () =>
      import('./module3/module3.routes').then((m) => m.module3Routes),
  },

  // Module 3 : back-office institution
  {
    path: 'admin',
    loadChildren: () =>
      import('./module3-admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // Anciens chemins institution -> module admin
  {
    path: 'institution-registration',
    redirectTo: 'admin/inscription',
    pathMatch: 'full',
  },
  {
    path: 'admin-login',
    redirectTo: 'admin/login',
    pathMatch: 'full',
  },

  // Module 4 : superadmin
  {
    path: 'superadmin-login',
    loadComponent: () =>
      import('./module4-superadmin/superadmin-login/superadmin-login').then(
        (m) => m.SuperadminLogin
      ),
  },
  {
    path: 'superadmin',
    loadChildren: () =>
      import('./module4-superadmin/module4.routes').then(
        (m) => m.superadminRoutes
      ),
  },

  // Hub central de connexion
  {
    path: 'connexion',
    loadComponent: () =>
      import('./shared/connexion-hub/connexion-hub').then(
        (m) => m.ConnexionHub
      ),
  },

  // Compatibilité avec les anciens chemins
  {
    path: 'admin/layout',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },

  // Page introuvable -> accueil public
  {
    path: '**',
    redirectTo: 'public/landing',
  },
];
