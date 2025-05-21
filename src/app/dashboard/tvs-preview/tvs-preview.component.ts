import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tvs-preview',
  imports: [],
  templateUrl: './tvs-preview.component.html',
  styleUrl: './tvs-preview.component.css'
})

export class TvsPreviewComponent {
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

