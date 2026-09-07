import { Routes } from '@angular/router';

import { SuperadminLogin } from './module4-superadmin/superadmin-login/superadmin-login';

import { SuperadminLayout } from './module4-superadmin/superadmin-layout/superadmin-layout';

import { DashboardSuperadmin } from './module4-superadmin/dashboard-superadmin/dashboard-superadmin';

import { DemandesInscription } from './module4-superadmin/demandes-inscription/demandes-inscription';

import { ConsulterDemande } from './module4-superadmin/consulter-demande/consulter-demande';

import { InstitutionsSuperadmin } from './module4-superadmin/institutions-superadmin/institutions-superadmin';

import { Audit } from './module4-superadmin/audit/audit';

import { ParametresSuperadmin } from './module4-superadmin/parametres-superadmin/parametres-superadmin';


export const superadminRoutes: Routes = [

  
  {
    path: 'superadmin-login',
    component: SuperadminLogin
  },

  {
    path: 'superadmin',
    component: SuperadminLayout,

    children: [

      // Dashboard
      {
        path: 'dashboard',
        component: DashboardSuperadmin
      },

      // Demandes d'inscription
      {
        path: 'demandes-inscription',
        component: DemandesInscription
      },

      // Consultation d'une demande
      {
        path: 'demandes-inscription/:id',
        component: ConsulterDemande
      },

      // Institutions
      {
        path: 'institutions',
        component: InstitutionsSuperadmin
      },

      // Audit
      {
        path: 'audit',
        component: Audit
      },

      // Paramètres
      {
        path: 'parametres',
        component: ParametresSuperadmin
      },

      // Route par défaut
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];