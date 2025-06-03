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

import { MediaItem } from '../../../../types/media-type';
import { TV } from '../../../../types/tv-type';
// import { MediaService } from '../../../../services/media.service';

interface DialogData {
  mediaItem: MediaItem;
}

interface TVWithOrder {
  tv: TV;
  selected: boolean;
  order: number;
  startDate: Date | null;
  endDate: Date | null;
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
  mediaItem: MediaItem;
  allTVs: TV[] = [];
  tvOptions: TVWithOrder[] = [];

  constructor(
    public dialogRef: MatDialogRef<RelatedTvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    // private mediaService: MediaService
  ) {
    this.mediaItem = data.mediaItem;
  }

  ngOnInit(): void {
    // this.mediaService.getTvs().subscribe(tvs => {
    //   this.allTVs = tvs;
    //   this.tvOptions = this.allTVs.map((tv, index) => ({
    //     tv,
    //     selected: this.mediaItem.tvs.includes(tv.id),
    //     order: index + 1,
    //     startDate: this.mediaItem.startDate,
    //     endDate: this.mediaItem.endDate
    //   }));
    // });
  }

  onDrop(event: CdkDragDrop<TVWithOrder[]>): void {
    moveItemInArray(this.tvOptions, event.previousIndex, event.currentIndex);
    // Update order property based on new array order
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
      .map(tvOption => tvOption.tv.id);
    
    this.dialogRef.close({
      tvs: selectedTVs
    });
  }
}