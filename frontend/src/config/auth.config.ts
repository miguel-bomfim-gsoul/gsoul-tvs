import { environment } from '../environments/environment.development';
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin + '/dashboard',
  clientId: environment.googleAuth.clientId,
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  responseType: 'id_token token',
  showDebugInformation: true,
};