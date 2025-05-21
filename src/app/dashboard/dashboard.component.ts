import { Component, Input } from '@angular/core';
import { TvPreviewComponent } from './tv-preview/tv-preview.component';

@Component({
  selector: 'app-dashboard',
  imports: [TvPreviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  @Input({ required: true }) tvs!: {
  id: number;
  name: string;
  images: string[];
  }[];

  addTv() {
    this.tvs.push({
      id: this.tvs.length + 1,
      name: `Nova TV ${(this.tvs.length + 1)}`,
      images: [
        'https://images.unsplash.com/photo-1747607176057-175b357ef4ab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ]
    });
  }
}