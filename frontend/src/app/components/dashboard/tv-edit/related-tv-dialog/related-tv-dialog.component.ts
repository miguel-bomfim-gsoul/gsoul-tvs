import { Component, Inject, OnInit, DestroyRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MediaService } from '../../../../core/services/media.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TvService, TvType, RelatedTv } from '../../../../core/services/tv.service';

interface DialogData {
  mediaId: number
  relatedTvs: RelatedTv[]
}

interface TVWithOrder {
  tv: TvType;
  selected: boolean;
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
  currentMedia: DialogData;
  selectedTvs: number[] = []
  unselectedTvs: number[] = []
  allTVs: TvType[] = [];
  tvOptions: TVWithOrder[] = [];
  isChecked: boolean = false
  requestBodyRelateTv: { media_id: number, tv_ids: number[], unselectedTvsIds: number[] } = {
    media_id: 0,
    tv_ids: [],
    unselectedTvsIds: []
  }

  constructor(
    public dialogRef: MatDialogRef<RelatedTvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tvService: TvService,
    private mediaService: MediaService,
    private destroyRef: DestroyRef
  ) {
    this.currentMedia = data;
  }

  ngOnInit(): void {
    this.tvService.getAllTvs().subscribe(tvs => {
      this.allTVs = tvs;
      this.tvOptions = this.allTVs.map((tv, index) => ({
        tv,
        selected: this.currentMedia.relatedTvs.some(related => related.tv_id === tv.tv_id),
        media_id: this.currentMedia.mediaId
      }));
    });
  }

onCheckboxChange(event: MatCheckboxChange, tvOption: any) {
  const isChecked = event.checked;
  const tvId = tvOption.tv.tv_id;
  tvOption.selected = isChecked;

  if (isChecked) {
    if (!this.selectedTvs.includes(tvId)) {
      this.selectedTvs.push(tvId);
      this.unselectedTvs = this.unselectedTvs.filter(id => id !== tvId)
    }
  } else {
    if (!this.unselectedTvs.includes(tvId)) {
      this.unselectedTvs.push(tvId);
    }
    this.selectedTvs = this.selectedTvs.filter(id => id !== tvId);
  }

  this.requestBodyRelateTv = {
    media_id: this.currentMedia.mediaId,
    tv_ids: this.selectedTvs,
    unselectedTvsIds: this.unselectedTvs
  };
}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.requestBodyRelateTv) {
      this.mediaService.relateMediaTv(this.requestBodyRelateTv)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.dialogRef.close();
          },
          error: (error) => {
            console.error('Error adding TV:', error);
          }
      });
    } else {
      this.dialogRef.close();
    }
  }
}