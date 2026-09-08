# Livrable 2 : Architecture Sécurité & Authentification - CertiUni

Ce document détaille l'architecture de sécurité, la gestion des identités (IAM) et la protection contre les cybermenaces pour la plateforme CertiUni.

---

## 1. Mécanisme d'Authentification & Sessions (Dual Token)

Le système utilise un mécanisme à double jeton combiné au stockage en cache Redis pour assurer la réactivité et la révocation instantanée des sessions.

* **Access Token :**
  * **Format & Signature :** JWT signé via `RS256` (clé privée/publique) ou `HS256`.
  * **Durée de vie :** **15 minutes**.
  * **Stockage Côté Client :** En mémoire (State Angular / Context Service).
  * **Payload :**
    ```json
    {
      "sub": "b2c2e0b1-289d-4c3e-8fa1-7fbd610192a0",
      "email": "admin@univ-douala.cm",
      "role": "UNIV_ADMIN",
      "universityId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "iat": 1788528000,
      "exp": 1788528900
    }
    ```

* **Refresh Token :**
  * **Durée de vie :** **7 jours**.
  * **Stockage Côté Client :** Cookie sécurisé `HttpOnly`, `Secure`, `SameSite=Strict`.
  * **Gestion Côté Serveur :** Enregistré en cache Redis (Whitelisting/Blacklisting) pour autoriser la révocation immédiate en cas de déconnexion ou de suspicion d'intrusion.

* **Route de Rafraîchissement :** `POST /api/v1/auth/refresh`

* **Authentification Multi-Facteurs (MFA/TOTP) :**
  * **Obligatoire** pour les rôles à privilèges élevés (`SUPER_ADMIN` et `UNIV_ADMIN`) via TOTP (Google Authenticator, Authy).
  * Implémenté via algorithme RFC 6238. Les clés secrètes sont chiffrées en base via **AES-256-GCM**.

* **Hachage des Mots de Passe :**
  * Algorithme **Argon2id** (ou `bcrypt` avec un facteur de coût minimum $\ge 12$).

---

## 2. Contrôle d'Accès basé sur les Rôles (RBAC) & Multi-Tenancy

### 2.1 Matrice des Rôles et Périmètres (Scope)

| Rôle | Périmètre d'Action (Scope) & Routes Principales |
| :--- | :--- |
| **`PUBLIC`** *(Anonyme)* | Accès restreint uniquement à la vérification de document (`GET /api/v1/verify/:hash`). |
| **`STUDENT`** | Consultation du portefeuille d'attestations et historique (`GET /api/v1/wallet/me`, `POST /api/v1/requests`). |
| **`VERIFIER`** | Consultation des logs et rapports de vérification pour les entreprises/tiers enregistrés. |
| **`ISSUER`** | Génération et signature de diplômes individuels pour son établissement uniquement. |
| **`UNIV_ADMIN`** | Importation massive (`POST /api/v1/batch/upload`), gestion des agents `ISSUER`, révocations, configuration des services/tarifs de son université. |
| **`SUPER_ADMIN`** | Gestion globale des universités (`POST /api/v1/universities`), création des accès `UNIV_ADMIN`, consultation des journaux globaux (`security_audit_logs`). |

### 2.2 Isolation des Données (Multi-Tenant)
Chaque requête d'un utilisateur authentifié passe par le middleware `tenant.middleware.ts`, qui garantit le cloisonnement strict des universités en injectant la contrainte tenant :

```typescript
// Exemple de vérification d'isolation tenant dans le middleware
export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  // SUPER_ADMIN dispose d'une vue globale cross-tenant
  if (user.role === 'SUPER_ADMIN') {
    return next();
  }

  if (!user.universityId) {
    return res.status(403).json({ message: "Erreur d'isolation : aucun établissement rattaché." });
  }

  // Injection forcée du filtre de tenant dans les requêtes ORM
  req.tenantFilter = { universityId: user.universityId };
  next();
}