import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthGoogleService } from '../core/services/auth-google.service';

@Component({
    selector: 'app-login',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        CommonModule
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css'
})

export class AuthComponent {
  isLoading = false;

  constructor(
    private authService: AuthGoogleService,
    private router: Router
  ) {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    try {
      this.authService.login();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
