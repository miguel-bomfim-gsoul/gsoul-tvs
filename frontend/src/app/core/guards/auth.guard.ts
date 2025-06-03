import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from "../services/auth-google.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
    constructor(
    private authService: AuthGoogleService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    await this.authService.initialize();
    if (this.authService.isAuthenticated()) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
}