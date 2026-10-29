<<<<<<< HEAD
﻿import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
=======
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
<<<<<<< HEAD
import { provideAnimations } from '@angular/platform-browser/animations';
=======
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60

import { routes } from './app.routes';
import { MockApiInterceptor } from './core/interceptors/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
<<<<<<< HEAD
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // Mode mock en local (environment.useMock), laisse passer en production.
    { provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true },
    // Requis par les dialogs / bottom-sheet Material du module3.
    provideAnimations(),
=======
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true },
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60
  ],
};
