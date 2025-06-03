import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component'
import {  AuthGoogleService } from './core/services/auth-google.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private location = inject(Location)
  currentPath = this.location.path();

  constructor(public authService: AuthGoogleService) {}

  showMenu(): boolean {
    return this.currentPath.includes('dashboard');
  }
}
