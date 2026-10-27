# CertiUni — Integration backend NestJS (document de travail v2)

> **Aucun endpoint invente** : seuls figurent ici ceux deja presents dans le code
> frontend. Les contrats API NestJS ne sont pas encore fournis ; ce document liste
> les besoins d'integration en attendant leur definition.
> Mis a jour apres : nouvelle arborescence des logins, pages Coming Soon,
> Hub Connexion, repositionnement du module superadmin.

## 1. Architecture frontend actuelle (apres integration)

```
/public/*    -> Module 1  : portail public / recruteur (verdicts, scan, bulk)
  /public/login, /public/connexion (hub), /public/bientot (page generique)
/student/*   -> Module 3  : espace etudiant (login magic-link, dashboard, archive)
  /student/bientot (page generique du module)
/admin/*     -> Module 3-admin : back-office institution (AdminLayout)
  /admin/login, /admin/inscription (hors layout, DANS le module)
  /admin/dashboard, creer-diplomes/*, diplomes-emis/*, logs-verification,
  mon-institution, parametres, bientot
/superadmin/*-> Module 4 : superadmin MINESUP (SuperadminLayout)
  /superadmin/login (hors layout, DANS le module)
  /superadmin/dashboard, demandes-inscription/*, institutions, audit, parametres,
  bientot
/connexion   -> Hub central « Se connecter » (choix du profil)
/admin-login, /superadmin-login, /institution-registration, /admin/layout
             -> redirections de compatibilite vers les chemins ci-dessus
```

## 2. Logins — 1 par module (recables vers le backend)

| Module | Page login | Destination apres connexion | Stockage actuel (NON securise) |
|---|---|---|---|
| M1 recruteur | `/public/login` | `/public/accueil` | `localStorage['recruteur_user']` |
| M3 etudiant | `/student/login` (magic-link simule) | `/student/dashboard` | `StudentService` en memoire |
| M3-admin | `/admin/login` | `/admin/dashboard` | `setTimeout` simule |
| M4 superadmin | `/superadmin/login` | `/superadmin/dashboard` | `setTimeout` simule |

Deconnexions : M1 -> `/public/landing` ; etudiant -> `/student/login` ;
admin -> `/admin/login` ; superadmin -> `/superadmin/login`.

## 3. Pages Coming Soon (boutons sans page dediee)

Composant partage `shared/coming-soon` (visuel CertiUni, param `?page=`) monte dans
chaque module : `/public/bientot`, `/student/bientot`, `/admin/bientot`,
`/superadmin/bientot`. Tout bouton sans page dediee y redirige au lieu de rester
mort ou de logger en console. Au branchement backend, remplacer ces redirections
par les vraies pages/fonctions une a une.

## 4. Configuration centralisee (deja en place)

- `src/environments/environment.ts` (prod) : `apiUrl: 'https://api.certiuni.cm/api/v1'`, `useMock: false`
- `src/environments/environment.development.ts` (dev) : `apiUrl: 'http://localhost:3000/api/v1'`, `useMock: true`
- Bascule : passer `useMock: false` quand le backend sera pret.
- Seuls 2 fichiers consomment `environment` : `core/services/certificate.service.ts`
  et `core/interceptors/mock-api.interceptor.ts`. Aucune URL API codee en dur.

## 5. Couche HTTP existante

- `core/services/certificate.service.ts` — appels reels deja codes :
  - `GET /certificates/verify/:hash`
  - `GET /student/wallet`
  - `POST /payments/initiate`
  - `GET /payments/status/:transactionId`
  - `POST /auth/magic-link`
  - `POST /admin/certificates/batch-import`
  - `GET /admin/cyber-radar/logs`
- `core/interceptors/mock-api.interceptor.ts` : sert ces routes en mock si
  `useMock === true`, laisse passer sinon.

## 6. Donnees simulees / statiques (a remplacer progressivement)

| Source | Module | Contenu |
|---|---|---|
| `core/services/mock-data.service.ts` | M1 | verifications, candidats, bulk |
| `src/assets/data/mock-data.json`, `src/data/mock-data.json`, `mock-data.admin.ts`, `mock-data-superadmin.ts` | M1/M3/M4 | jeux statiques (doublons a fusionner) |
| `src/assets/mocks/api-example.json` | transverse | reponses MockApiInterceptor |
| `module3/student-service/student.service.ts` | M3 etudiant | charge `assets/data/mock-data.json` |
| `module3-admin/services/{admin-state,diploma-creation-state,diplomes-emis-state}.ts` | M3-admin | etat signaux en memoire |
| `module4-superadmin/services/superadmin-state.ts` | M4 | demandes d'inscription en memoire |

## 7. Composants a connecter quand l'API existera

- **M1** : `ecran-accueil`, `verdict-*`, `bulk-upload`, `bulk-table`,
  `candidate-drawer`, `momo-checkout`, `ocr-scan` (aujourd'hui `MockDataService`).
- **M3 etudiant** : `dashboard`, `archive`, `login` (remplacer `loadData()` mock
  par wallet/certificates/payments).
- **M3-admin** : flux `creer-diplomes` (import CSV, validation, generation,
  emission), `diplomes-emis`, `logs-verification` (services d'etat signaux).
- **M4** : `demandes-inscription`, `institutions`, `audit` (`SuperadminState`).
- **Hub Connexion** (`shared/connexion-hub`) : statique, rien a brancher sauf
  masquage de profils selon disponibilite backend.

## 8. Authentification — statut honnete

- **Aucune auth reelle n'est securisee** (localStorage / setTimeout / memoire).
- Fichiers prevus mais **vides** : `core/services/auth.service.ts`,
  `core/services/verify.service.ts`, `core/guards/auth.guard.ts`,
  `core/interceptors/jwt.interceptor.ts`.
- A definir avec le backend : JWT, refresh, roles (recruteur, etudiant, admin
  institution, superadmin), guards de routes par role.

## 9. Etapes suivantes (des que les contrats API sont fournis)

1. Valider chaque contrat (payloads, codes HTTP, erreurs) avec le backend NestJS.
2. Implementer `auth.service.ts` + `jwt.interceptor.ts` + `auth.guard.ts` ;
   brancher les 4 flux de connexion.
3. Remplacer les mocks module par module, en gardant `MockApiInterceptor`.
4. Fusionner les doublons `mock-data.json` + mocks TS en un dossier unique.
5. Remplacer les redirections Coming Soon par les vraies fonctionnalites.
6. Couvrir les nouveaux services de tests unitaires (`ng test`).
