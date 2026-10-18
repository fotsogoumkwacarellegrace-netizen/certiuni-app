# 03. Diagrammes de Flux de Données (Data Flow) - CertiUni

Ce document décrit la circulation technique des données pour les processus critiques du système : l'architecture globale, l'émission asynchrone de diplômes en masse, et la vérification publique.

---

## 1. Vue d'Ensemble de l'Architecture Système

```mermaid
graph TD
    subgraph FRONTEND ["1. COUCHE FRONTEND (SPA Angular)"]
        UI1["Module 1: Tunnel Public & Audit"]
        UI2["Module 2: Academic Wallet Étudiant"]
        UI3["Module 3: Tour de Contrôle & Dashboard MINESUP"]
    end

    FRONTEND -->|HTTPS / REST / WebSockets| GATEWAY

    subgraph GATEWAY ["2. PASSERELLE & SÉCURITÉ (API Gateway / Middleware)"]
        RL["Rate Limiter Redis (Anti-DDoS)"]
        MT["Guard Multi-Tenant (Isolation par Domaine)"]
        AUTH["Auth Middleware (JWT / MFA TOTP)"]
    end

    GATEWAY --> BACKEND

    subgraph BACKEND ["3. SERVEUR BACKEND (Node.js / Express)"]
        VERIF["Module Verification (SQL & Hash SHA-256)"]
        WALLET["Module Auth/Wallet (Magic Link & Quotas)"]
        ADMIN["Module Cyber/Admin (MFA & Audit)"]
    end

    BACKEND --> BDD[(PostgreSQL - Core Ledger)]
    BACKEND --> REDIS[(Redis Cache - Rate Limit & Verif < 500ms)]
    BACKEND --> API_EXT["Services Tiers (MTN / Orange / Webhooks / Payment)"]

    REDIS --> QUEUE["Queue de Travaux (BullMQ)"]
    QUEUE --> WORKER["Worker Puppeteer (Génération PDF 300 DPI)"]
    WORKER --> S3[(Stockage Objets S3 / MinIO - Bucket WORM)]
sequenceDiagram
    autonumber
    actor Admin as Admin Université (ADMIN_UNIV)
    participant API as API Express (Backend)
    participant Queue as File Redis (BullMQ)
    participant Worker as Worker Puppeteer
    participant S3 as Stockage S3 / MinIO (WORM)
    participant DB as PostgreSQL (Core Ledger)

    Admin->>API: 1. Upload fichier Excel/CSV + Paramètres
    API->>API: 2. Vérification JWT & Droits Tenant (`universityId`)
    API->>DB: 3. Création/Mise à jour des profils Étudiants
    API->>Queue: 4. Empilement des tâches de génération (Batch)
    API-->>Admin: 5. Réponse 202 Accepted (Job ID)

    par Traitement Asynchrone par Worker
        Worker->>Queue: 6. Dépilement de la tâche
        Worker->>Worker: 7. Calcul du Hash SHA-256 Canonique
        Worker->>Worker: 8. Génération du QR Code PNG
        Worker->>Worker: 9. Rendu HTML/CSS -> PDF (Puppeteer)
        Worker->>S3: 10. Upload du PDF certifié (Bucket WORM)
        Worker->>DB: 11. Insertion Diplôme (status: ISSUED, canonicalHash, pdfKey)
        Worker->>DB: 12. Insertion Log d'Audit (CERTIFICATE_ISSUED)
    end 
sequenceDiagram
    autonumber
    actor Public as Recruteur / Public
    participant Front as Frontend Web (Angular)
    participant API as API Express (`/api/v1/verify`)
    participant Redis as Redis Cache / Rate Limit
    participant DB as PostgreSQL (Core Ledger)

    Public->>Front: 1. Scan QR Code ou Saisie du Hash
    Front->>API: 2. Requête GET `/api/v1/verify/:hash`
    API->>Redis: 3. Check Rate Limit IP (Max 30 req/min)

    alt Limite dépassée
        Redis-->>API: Dépassement détecté (> 30 req/min)
        API-->>Front: HTTP 429 Too Many Requests
    else Limite autorisée
        API->>DB: 4. Requête SQL SELECT par `canonicalHash` ou `publicIdentifier`

        alt Hash trouvé (Statut: ISSUED)
            DB-->>API: Données du diplôme
            API->>DB: 5. Log de vérification (result: SUCCESS)
            API-->>Front: HTTP 200 OK (Métadonnées + Statut Vert)
        else Hash trouvé (Statut: REVOKED)
            DB-->>API: Données du diplôme révoqué
            API->>DB: 5. Log de vérification (result: REVOKED)
            API-->>Front: HTTP 200 OK (Motif Révocation + Statut Rouge)
        else Hash introuvable
            DB-->>API: Aucun résultat
            API->>DB: 5. Log de vérification (result: FAILED)
            API-->>Front: HTTP 404 Not Found (Document Invalide / Statut Gris)
        end
    end       