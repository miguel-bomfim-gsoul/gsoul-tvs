import { Component, Input } from '@angular/core';

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
  selector: 'app-tv-edit',
  imports: [],
  templateUrl: './tv-edit.component.html',
  styleUrl: './tv-edit.component.css'
})
export class TvEditComponent {
  @Input({ required: true }) selectedTv?: TvType
}
