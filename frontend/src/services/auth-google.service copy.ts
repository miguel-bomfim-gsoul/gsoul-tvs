import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../config/auth.config';

@Injectable({
  providedIn: 'root',
})

export class AuthGoogleService {
  private allowedEmails = ['miguel.bomfim@gsoul.com.br'];

  constructor(private oauthService: OAuthService) {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
    this.oauthService.revokeTokenAndLogout();
  }

  isLoggedIn(): boolean {
    const claims: any = this.oauthService.getIdentityClaims();
    const email = claims?.email;

    if (this.oauthService.hasValidIdToken() && this.allowedEmails.includes(email)) {
      return true    
    } else {
      this.logout()
      return false
    }
  }

}