<<<<<<< HEAD
﻿import 'zone.js';

// frontend/src/main.ts
=======
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

<<<<<<< HEAD
bootstrapApplication(App, appConfig).catch((err) => {
  console.error('Erreur de bootstrap:', err);
  document.body.innerHTML = `
      <div style="color: red; padding: 20px; font-family: monospace;">
        <h2>Erreur de chargement</h2>
        <pre>${err.message}</pre>
      </div>
    `;
});
=======
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60
