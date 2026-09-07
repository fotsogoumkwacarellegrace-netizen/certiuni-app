import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirection par défaut vers l'accueil public (chemin RELATIF, pas '/public/accueil')
   { path: '', redirectTo: 'public/landing', pathMatch: 'full' },

  // Module 1 : Portail public
  {
    path: 'public',
    loadChildren: () =>
      import('./module1/module1.routes').then(m => m.MODULE1_ROUTES)
  },

  // Route 404
  { path: '**', redirectTo: 'public/accueil' }
];