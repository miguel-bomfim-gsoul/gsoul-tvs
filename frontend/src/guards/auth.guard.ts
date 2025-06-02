import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthGoogleService } from "../services/auth-google.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthGoogleService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    await this.authService.initialize();
    return this.authService.isAuthenticated()
      ? true
      : this.router.createUrlTree(['/login']);
  }
}