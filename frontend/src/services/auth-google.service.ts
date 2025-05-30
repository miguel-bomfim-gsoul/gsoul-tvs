import { Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../config/auth.config';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})

export class AuthGoogleService {
  private allowedEmails = ['miguel.bomfim@gsoul.com.br'];
  private isAuthenticated = signal<boolean>(false)
  private initialized = false;

  constructor(private oauthService: OAuthService, private router: Router) {
    this.initConfiguration();
  }

  async ensureLoginInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.initialized = true;
    }
  }

  initConfiguration() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {

      if (this.oauthService.hasValidIdToken()) {
        const claims: any = this.oauthService.getIdentityClaims();
        const email = claims?.email;

          if (!this.allowedEmails.includes(email)) {
            this.logout();
            this.isAuthenticated.set(false)
          } else {
            this.isAuthenticated.set(true)
          }
      }
    });
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.revokeTokenAndLogout();
    this.oauthService.logOut();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated()
  }

}