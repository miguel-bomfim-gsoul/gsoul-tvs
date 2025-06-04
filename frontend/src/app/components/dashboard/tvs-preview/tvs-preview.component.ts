import { Component, Input, Output, EventEmitter } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { TvType } from "../../../core/services/tv.service"

@Component({
  selector: 'app-tvs-preview',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './tvs-preview.component.html',
  styleUrl: './tvs-preview.component.css'
})

export class TvsPreviewComponent {
  @Input({ required: true }) selectedTv?: TvType
  @Input({ required: true }) tv!: TvType;
  @Output() edit = new EventEmitter()
  @Output() delete = new EventEmitter()

  onClickEdit() {
    this.edit.emit(this.tv.id)
  }

  onClickDelete() {
    this.delete.emit(this.tv.id)
  }

  onClickViewTv() {
    window.open(`/tv/${this.tv.id}`, '_blank');
  }
}