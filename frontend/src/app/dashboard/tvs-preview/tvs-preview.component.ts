import { Component, Input, Output, EventEmitter } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

interface MediaType {
  id: number
  url_image: string
  media_order: number
}

interface TvType {
  id: number
  name: string
  tv_slug: string
  images?: MediaType[]
}

@Component({
  selector: 'app-tvs-preview',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './tvs-preview.component.html',
  styleUrl: './tvs-preview.component.css'
})
export class TvsPreviewComponent {
  @Input({ required: true }) tv!: TvType;

  @Output() edit = new EventEmitter()

  onClickEdit() {
    this.edit.emit(this.tv.id)
  }

  onClickViewTv() {
    window.open(`/tv/${this.tv.tv_slug}`, '_blank');
  }
}

