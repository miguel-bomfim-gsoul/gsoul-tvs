import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { MenuComponent } from './menu/menu.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gsoul-tvs';
  private location = inject(Location)
  currentPath = this.location.path();

  showMenu(): boolean {
    return this.currentPath.includes('dashboard');
  }

}
