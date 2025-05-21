import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tv-preview',
  imports: [],
  templateUrl: './tv-preview.component.html',
  styleUrl: './tv-preview.component.css'
})

export class TvPreviewComponent {
  @Input({ required: true }) tv!: {
    id: string;
    name: string;
    images: string[];
  };

  @Output() edit = new EventEmitter()

  onClickEdit() {
    this.edit.emit(this.tv.id)
  }
}

