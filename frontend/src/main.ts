// frontend/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => {
  console.error('Erreur de bootstrap:', err);
  document.body.innerHTML = `
      <div style="color: red; padding: 20px; font-family: monospace;">
        <h2>Erreur de chargement</h2>
        <pre>${err.message}</pre>
      </div>
    `;
});
