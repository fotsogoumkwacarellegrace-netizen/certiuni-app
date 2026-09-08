import puppeteer from 'puppeteer';

export interface CertificatePdfData {
    publicIdentifier: string;
    studentName: string;
    degreeTitle: string;
    fieldOfStudy: string;
    grade: string;
    issueDate: string;
    universityName: string;
    universityLogoUrl?: string | null;
    canonicalHash: string;
    qrCodeDataUrl: string;
}

/**
 * Construit le modèle HTML/CSS du diplôme officiel
 */
const generateCertificateHtml = (data: CertificatePdfData): string => {
    const formattedDate = new Date(data.issueDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Diplôme - ${data.publicIdentifier}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #ffffff;
          color: #1a202c;
          -webkit-print-color-adjust: exact;
        }
        .certificate-container {
          width: 297mm;
          height: 210mm;
          box-sizing: border-box;
          padding: 15mm 20mm;
          position: relative;
          background: #ffffff;
        }
        .outer-border {
          border: 4px double #1e3a8a;
          height: 100%;
          box-sizing: border-box;
          padding: 10mm;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .header {
          text-align: center;
        }
        .university-logo {
          max-height: 65px;
          margin-bottom: 8px;
        }
        .university-name {
          font-size: 22px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #1e3a8a;
          margin: 0;
        }
        .subtitle {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #64748b;
          margin-top: 4px;
        }
        .content {
          text-align: center;
          margin-top: -10px;
        }
        .certify-text {
          font-size: 14px;
          font-style: italic;
          color: #475569;
          margin-bottom: 8px;
        }
        .student-name {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          border-bottom: 2px solid #cbd5e1;
          display: inline-block;
          padding-bottom: 4px;
          margin-bottom: 12px;
        }
        .degree-text {
          font-size: 15px;
          color: #334155;
          margin-bottom: 6px;
        }
        .degree-title {
          font-size: 26px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 4px 0;
        }
        .field-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 10px;
        }
        .grade-text {
          font-size: 13px;
          font-weight: 500;
          color: #475569;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid #e2e8f0;
          padding-top: 12px;
        }
        .qr-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qr-code {
          width: 85px;
          height: 85px;
        }
        .hash-info {
          font-size: 9px;
          color: #64748b;
          font-family: 'Courier New', Courier, monospace;
          max-width: 280px;
          text-align: left;
        }
        .hash-title {
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 2px;
        }
        .signature-section {
          text-align: center;
        }
        .signature-line {
          width: 180px;
          border-top: 1px solid #0f172a;
          margin-top: 35px;
          margin-bottom: 4px;
        }
        .signature-title {
          font-size: 11px;
          font-weight: bold;
          color: #334155;
        }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <div class="outer-border">
          
          <!-- En-tête de l'établissement -->
          <div class="header">
            ${data.universityLogoUrl
            ? `<img class="university-logo" src="${data.universityLogoUrl}" alt="Logo" />`
            : ''
        }
            <h1 class="university-name">${data.universityName}</h1>
            <div class="subtitle">République du Cameroun — Paix - Travail - Patrie</div>
          </div>

          <!-- Corps du diplôme -->
          <div class="content">
            <div class="certify-text">Atteste que le diplôme officiel a été décerné à</div>
            <div class="student-name">${data.studentName}</div>
            <div class="degree-text">pour avoir satisfait aux exigences du programme d'études en</div>
            <div class="degree-title">${data.degreeTitle}</div>
            <div class="field-title">Option : ${data.fieldOfStudy}</div>
            <div class="grade-text">Mention : <strong>${data.grade}</strong> | Délivré le : <strong>${formattedDate}</strong></div>
          </div>

          <!-- Pied de page & Sécurité -->
          <div class="footer">
            <div class="qr-section">
              <img class="qr-code" src="${data.qrCodeDataUrl}" alt="QR Code de vérification" />
              <div class="hash-info">
                <div class="hash-title">VERIFICATION OFFICIELLE CERTIUNI</div>
                <div>ID : <strong>${data.publicIdentifier}</strong></div>
                <div style="word-break: break-all;">SHA-256 : ${data.canonicalHash}</div>
              </div>
            </div>

            <div class="signature-section">
              <div class="signature-line"></div>
              <div class="signature-title">Le Recteur / Le Directeur</div>
            </div>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Génère un Buffer PDF à partir des données d'un diplôme
 */
export const generateCertificatePdf = async (data: CertificatePdfData): Promise<Buffer> => {
    let browser = null;

    try {
        // Lancement de l'instance Puppeteer sans bac à sable (requis pour Docker)
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        });

        const page = await browser.newPage();
        const htmlContent = generateCertificateHtml(data);

        // Injection du contenu HTML
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Génération du PDF au format A4 Paysage
        const pdfUint8Array = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        });

        return Buffer.from(pdfUint8Array);
    } catch (error) {
        console.error('Erreur lors de la génération du PDF avec Puppeteer :', error);
        throw new Error('Échec de la génération du fichier PDF.');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};