import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TvType } from "../../../core/services/tv.service"
import { environment } from '../../../../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { TvService } from '../../../core/services/tv.service'

@Component({
  selector: 'app-tvs-preview',
  imports: [MatButtonModule, MatIconModule, MatCardModule, FormsModule],
  templateUrl: './tvs-preview.component.html',
  styleUrl: './tvs-preview.component.css'
})

export class TvsPreviewComponent implements OnChanges {
  @Input({ required: true }) selectedTv?: TvType
  @Input({ required: true }) tv!: TvType;
  @Output() edit = new EventEmitter()
  @Output() delete = new EventEmitter()
  mediaBaseUrl = environment.apiUrl

  constructor(
    private tvService: TvService,
  ) {}

  editingName = false;
  editedName: string = '';

  @ViewChild('nameInput') nameInputRef!: ElementRef<HTMLInputElement>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTv'] && this.selectedTv?.tv_id === this.tv.tv_id) {
      this.startEditingTitle();
      setTimeout(() => {
        this.nameInputRef?.nativeElement.select();
      });
    }
  }

  startEditingTitle() {
    this.editingName = true;
    this.editedName = this.tv.tv_name;
    setTimeout(() => {
      this.nameInputRef?.nativeElement.focus();
    });
  }

  saveName() {
    if (this.editedName.trim()) {
      this.tv.tv_name = this.editedName.trim();
    }
    this.editingName = false;

    this.tvService.updateName({name: this.editedName, tv_id: this.tv.tv_id}).subscribe({
      next(value) {
          console.log('value', value)
      },
    })
  }

  cancelEditingTitle() {
    this.editingName = false;
  }

  onClickEdit() {
    this.edit.emit(this.tv.tv_id)
  }

  onClickDelete() {
    this.delete.emit(this.tv.tv_id)
  }

  onClickViewTv() {
    window.open(`/tv/${this.tv.tv_id}`, '_blank');
  }
}