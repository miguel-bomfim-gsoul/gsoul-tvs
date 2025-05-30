import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthGoogleService } from '../../services/auth-google.service';

@Component({
    selector: 'app-login',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css'
})

export class AuthComponent {
    private authService = inject(AuthGoogleService);

    signInWithGoogle() {
        this.authService.login();
    }
}
