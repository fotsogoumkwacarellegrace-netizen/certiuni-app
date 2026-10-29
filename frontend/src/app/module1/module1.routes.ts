// src/app/module1/module1.routes.ts
import { Routes } from '@angular/router';

export const MODULE1_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./module1.component').then(m => m.Module1Component),
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },

      // ===== Pages plein écran (sans sidebar) =====
      {
        path: 'landing',
        loadComponent: () => import('./landing/landing').then(m => m.Landing)
      },
      {
        path: 'espaces',
        loadComponent: () => import('./espaces/espaces').then(m => m.Espaces)
      },
      {
        path: 'espaces-inscription',
        loadComponent: () => import('./espaces-inscription/espaces-inscription').then(m => m.EspacesInscription)
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./recruiter-register/recruiter-register').then(m => m.RecruiterRegister)
      },
      {
        path: 'verify/:id',
        loadComponent: () => import('./verdict-valid/verdict-valid').then(m => m.VerdictValid)
      },
      {
        path: 'verify/revoked/:id',
        loadComponent: () => import('./verdict-revoked/verdict-revoked').then(m => m.VerdictRevoked)
      },
      {
        path: 'verify/unknown/:id',
        loadComponent: () => import('./verdict-unknown/verdict-unknown').then(m => m.VerdictUnknown)
      },
      {
        path: 'momo-checkout',
        loadComponent: () => import('./momo-checkout/momo-checkout').then(m => m.MomoCheckout)
      },
      {
        path: 'candidate-drawer/:id',
        loadComponent: () => import('./candidate-drawer/candidate-drawer').then(m => m.CandidateDrawer)
      },
      {
        path: 'pdf-viewer/:id',
        loadComponent: () => import('./pdf-viewer/pdf-viewer').then(m => m.PdfViewer)
      },

      // ===== Pages avec sidebar (Shell) =====
      {
        path: '',
        loadComponent: () => import('./shell/shell').then(m => m.Shell),
        children: [
          {
            path: 'accueil',
            loadComponent: () => import('./ecran-accueil/ecran-accueil').then(m => m.EcranAccueil)
          },
          {
            path: 'camera-scan',
            loadComponent: () => import('./camera-scan/camera-scan').then(m => m.CameraScan)
          },
          {
            path: 'ocr-scan',
            loadComponent: () => import('./ocr-scan/ocr-scan').then(m => m.OcrScan)
          },
          {
            path: 'bulk-upload',
            loadComponent: () => import('./bulk-upload/bulk-upload').then(m => m.BulkUpload)
          },
          {
            path: 'bulk-table',
            loadComponent: () => import('./bulk-table/bulk-table').then(m => m.BulkTable)
          },
          {
            path: 'settings',
            loadComponent: () => import('./settings/settings').then(m => m.Settings)
          },

          {
            path: 'credits',
            loadComponent: () => import('./credits/credits').then(m => m.Credits)
          }
        ]
      }
    ]
  }
];