// auth.service.ts
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../config/auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    // Configure the library with your Google settings
    this.oauthService.configure(authConfig);
    // Try to discover the discovery document and then automatically login if possible.
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  public async initialize(): Promise<void> {
    // Wait for the discovery document and try login process to complete.
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  // This method starts the login flow.
  public login() {
    this.oauthService.initCodeFlow();
  }

  // Log out the user.
  public logout() {
    this.oauthService.logOut();
  }

  // Returns identity claims (like email and name)
  public get identityClaims(): any {
    return this.oauthService.getIdentityClaims() || null;
  }

  // Quick check for a valid access token.
  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
