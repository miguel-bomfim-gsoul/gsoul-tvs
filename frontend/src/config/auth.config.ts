import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: 'http://localhost:4200/dashboard',
  clientId: '634580005854-a1n4tq836ttcttt9bv2ce3755o0rh74d.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
   responseType: 'id_token token',
  showDebugInformation: true,
};