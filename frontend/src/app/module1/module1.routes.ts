// src/app/module1/module1.routes.ts
import { Routes } from '@angular/router';

export const MODULE1_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./module1.component').then(m => m.Module1Component),
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },

      {
        path: 'landing',
        loadComponent: () =>
          import('./landing/landing').then(m => m.Landing)
      },
      {
        path: 'accueil',
        loadComponent: () =>
          import('./ecran-accueil/ecran-accueil').then(m => m.EcranAccueil)
      },
      {
        path: 'camera-scan',
        loadComponent: () =>
          import('./camera-scan/camera-scan').then(m => m.CameraScan)
      },
      {
        path: 'ocr-scan',
        loadComponent: () =>
          import('./ocr-scan/ocr-scan').then(m => m.OcrScan)
      },
      {
        path: 'bulk-upload',
        loadComponent: () =>
          import('./bulk-upload/bulk-upload').then(m => m.BulkUpload)
      },
      {
        path: 'bulk-table',
        loadComponent: () =>
          import('./bulk-table/bulk-table').then(m => m.BulkTable)
      },
      {
        path: 'verify/:id',
        loadComponent: () =>
          import('./verdict-valid/verdict-valid').then(m => m.VerdictValid)
      },
      {
        path: 'verify/revoked/:id',
        loadComponent: () =>
          import('./verdict-revoked/verdict-revoked').then(m => m.VerdictRevoked)
      },
      {
        path: 'verify/unknown/:id',
        loadComponent: () =>
          import('./verdict-unknown/verdict-unknown').then(m => m.VerdictUnknown)
      },
      {
        path: 'momo-checkout',
        loadComponent: () =>
          import('./momo-checkout/momo-checkout').then(m => m.MomoCheckout)
      },
      {
        path: 'candidate-drawer/:id',
        loadComponent: () =>
          import('./candidate-drawer/candidate-drawer').then(m => m.CandidateDrawer)
      },
      {
        path: 'pdf-viewer/:id',
        loadComponent: () =>
          import('./pdf-viewer/pdf-viewer').then(m => m.PdfViewer)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login').then(m => m.Login)
      },
      // Route Paramètres
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings').then(m => m.Settings)
      },
      // Hub central « Se connecter » (choix du profil)
      {
        path: 'connexion',
        loadComponent: () =>
          import('../shared/connexion-hub/connexion-hub').then(m => m.ConnexionHub)
      },
      // Page « fonctionnalité en préparation » (liens sans page dédiée)
      {
        path: 'bientot',
        loadComponent: () =>
          import('../shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      }
    ]
  }
];