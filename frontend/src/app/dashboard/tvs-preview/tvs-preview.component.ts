import { Component, Input, Output, EventEmitter } from '@angular/core';

interface MediaType {
  id: number
  url_image: string
  media_order: number
}

interface TvType {
  id: number
  name: string
  images?: MediaType[]
}

@Component({
  selector: 'app-tvs-preview',
  imports: [],
  templateUrl: './tvs-preview.component.html',
  styleUrl: './tvs-preview.component.css'
})
export class TvsPreviewComponent {
  @Input({ required: true }) tv!: TvType;

  @Output() edit = new EventEmitter()

  onClickEdit() {
    this.edit.emit(this.tv.id)
  }
}

