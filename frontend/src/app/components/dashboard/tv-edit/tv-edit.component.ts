import { Component, Inject, OnInit, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { MediaItem } from '../../../types/media-type';
import { MediaType } from '../../../core/services/media.service';
import { TvType} from '../../../core/services/tv.service';
import { RelatedTvDialogComponent } from './related-tv-dialog/related-tv-dialog.component';

@Component({
  selector: 'app-tv-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tv-edit.component.html',
  styleUrl: './tv-edit.component.css'
})
export class TvEditComponent implements OnInit {
  @Input({ required: true }) selectedTv?: TvType
  mediaItems: MediaType[] | undefined = []
  displayedColumns: string[] = ['order', 'thumbnail', 'name', 'duration', 'dates', /*'tvs'*/ 'actions'];
  dataSource = new MatTableDataSource<MediaType>([]);  

  constructor(
    // private mediaService: MediaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.selectedTv?.medias) {
      this.dataSource = new MatTableDataSource<MediaType>(this.selectedTv.medias.sort((a, b) => a.media_order - b.media_order));
    }

    // this.mediaService.getMediaItems().subscribe({
    //   next: (resData) => {
    //     this.mediaItems = [...resData].sort((a, b) => a.order - b.order)
    //     console.log('mediaItems', this.mediaItems)
    //   }
    // });
  }

  onDrop(event: CdkDragDrop<MediaItem[]>): void {
    moveItemInArray(this.mediaItems ?? [], event.previousIndex, event.currentIndex);
    // this.mediaService.updateMediaOrder(this.mediaItems);
  }

  openRelatedTvDialog(item: MediaItem): void {
    const dialogRef = this.dialog.open(RelatedTvDialogComponent, {
      width: '600px',
      data: { mediaItem: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.mediaService.updateMediaTVs(item.id, result.tvs);
      }
    });
  }

  updateDates(item: MediaItem, startDate: Date | null, endDate: Date | null): void {
    const updatedItem = { ...item, startDate, endDate };
    // this.mediaService.updateMediaItem(updatedItem);
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Not set';
    return date.toLocaleDateString();
  }

  getTvCount(item: MediaItem): number {
    return item.tvs.length;
  }
}
