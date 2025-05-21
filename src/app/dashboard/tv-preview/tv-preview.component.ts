import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tv-preview',
  imports: [],
  templateUrl: './tv-preview.component.html',
  styleUrl: './tv-preview.component.css'
})

export class TvPreviewComponent {
  @Input({ required: true }) tv!: {
    id: number;
    name: string;
    images: string[];
  };
}
