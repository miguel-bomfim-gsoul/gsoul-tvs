import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { TvService, TvType, RelatedTv } from '../../../../core/services/tv.service';

interface DialogData {
  mediaItem: RelatedTv[]
}

interface TVWithOrder {
  tv: TvType;
  selected: boolean;
  order: number;
}

@Component({
  selector: 'app-related-tv-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    DragDropModule
  ],
  templateUrl: './related-tv-dialog.component.html',
  styleUrls: ['./related-tv-dialog.component.css']
})
export class RelatedTvDialogComponent implements OnInit {
  relatedTvs: RelatedTv[];
  allTVs: TvType[] = [];
  tvOptions: TVWithOrder[] = [];

  constructor(
    public dialogRef: MatDialogRef<RelatedTvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tvService: TvService
  ) {
    this.relatedTvs = data.mediaItem;
  }

  ngOnInit(): void {
    this.tvService.getAllTvs().subscribe(tvs => {
      this.allTVs = tvs;
      this.tvOptions = this.allTVs.map((tv, index) => ({
        tv,
        selected: this.relatedTvs.some(related => related.tv_id === tv.tv_id),
        order: index + 1
      }));
    });
  }

  onDrop(event: CdkDragDrop<TVWithOrder[]>): void {
    moveItemInArray(this.tvOptions, event.previousIndex, event.currentIndex);
    this.tvOptions = this.tvOptions.map((item, index) => ({
      ...item,
      order: index + 1
    }));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const selectedTVs = this.tvOptions
      .filter(tvOption => tvOption.selected)
      .map(tvOption => tvOption.tv.tv_id);
    
    this.dialogRef.close({
      tvs: selectedTVs
    });
  }
}