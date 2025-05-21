import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tv-edit',
  imports: [],
  templateUrl: './tv-edit.component.html',
  styleUrl: './tv-edit.component.css'
})
export class TvEditComponent {
  @Input({ required: true }) selectedTv?: {
    id: string;
    name: string;
    images: string[];
  }
}
