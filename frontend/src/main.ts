/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import { AuthGoogleService } from './app/core/services/auth-google.service'
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
export function initializeAuth(authService: AuthGoogleService): () => Promise<void> {
  return () => authService.initialize();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
