import { Routes } from '@angular/router';

/**
 * Routes racines de l'application unifiee CertiUni.
 *
 *  /public/*    -> Module 1  : portail public (verification, recruteur)
 *  /student/*   -> Module 3  : espace etudiant
 *  /admin/*     -> Module 3  : back-office institution (AdminLayout)
 *  /superadmin/*-> Module 4  : superadmin (SuperadminLayout)
 */
export const routes: Routes = [
  // Racine -> portail public
  { path: '', redirectTo: 'public/landing', pathMatch: 'full' },

  // =========================================
  // Module 1 : Portail public (lazy)
  // =========================================
  {
    path: 'public',
    loadChildren: () =>
      import('./module1/module1.routes').then((m) => m.MODULE1_ROUTES),
  },

  // =========================================
  // Module 3 : Espace étudiant (lazy)
  // =========================================
  {
    path: 'student',
    loadChildren: () =>
      import('./module3/module3.routes').then((m) => m.module3Routes),
  },

  // =========================================
  // Module 3-admin : Back-office institution (lazy)
  // =========================================
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
  { path: 'admin-login', redirectTo: 'admin/login', pathMatch: 'full' },
  // (anciens chemins geres plus haut : institution-registration, admin-login)

  // =========================================
  // Module 4 : Superadmin (lazy)
  // =========================================
  // (login superadmin gere dans le module : /superadmin/login)
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
      import('./module4-superadmin/module4.routes').then((m) => m.superadminRoutes),
  },

  // =========================================
  // Hub central « Se connecter » (choix du profil) : chemin canonique /public/connexion
  // (le doublon /connexion est conserve par compatibilite)
  // =========================================
  {
    path: 'connexion',
    loadComponent: () =>
      import('./shared/connexion-hub/connexion-hub').then((m) => m.ConnexionHub),
  },
  // =========================================
  // Compatibilite : anciens chemins conserves
  // =========================================
  { path: 'admin/layout', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  // (routes canoniques /admin/login et /superadmin/login dans leurs modules)

  // 404 -> accueil public
  { path: '**', redirectTo: 'public/landing' },
];
