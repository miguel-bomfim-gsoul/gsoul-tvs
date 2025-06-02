// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../config/auth.config';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  isOn = signal<boolean>(false)

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient
  ) {
    this.initialize();
  }

  public async initialize(): Promise<void> {
    this.oauthService.configure(authConfig);
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (this.oauthService.hasValidIdToken()) {
      const claims: any = this.oauthService.getIdentityClaims();
      const email = claims?.email;

      try {
        const users = await firstValueFrom(
          this.http.get<{ id: number; email: string }[]>('http://localhost:3000/users')
        );

        const allowedEmails = users.map(user => user.email);

        if (!allowedEmails.includes(email)) {
          this.logout();
          this.isOn.set(false);
        } else {
          this.isOn.set(true);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários permitidos', error);
        this.logout();
        this.isOn.set(false);
      }
    }
  }

  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  public get identityClaims(): any {
    return this.oauthService.getIdentityClaims() || null;
  }

  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken() && this.isOn()
  }
}
