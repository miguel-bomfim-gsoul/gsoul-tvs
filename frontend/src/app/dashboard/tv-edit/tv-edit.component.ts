import { Component, Inject, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { MediaItem } from '../../types/media-type';
import { MediaService } from '../../../services/media.service';
import { RelatedTvDialogComponent } from './related-tv-dialog/related-tv-dialog.component';

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

  mediaItems: MediaItem[] = [];
  displayedColumns: string[] = ['order', 'thumbnail', 'name', 'duration', 'dates', 'tvs', 'actions'];

  constructor(
    private mediaService: MediaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.mediaService.getMediaItems().subscribe(items => {
      this.mediaItems = [...items].sort((a, b) => a.order - b.order);
    });
  }

  onDrop(event: CdkDragDrop<MediaItem[]>): void {
    moveItemInArray(this.mediaItems, event.previousIndex, event.currentIndex);
    this.mediaService.updateMediaOrder(this.mediaItems);
  }

  openRelatedTvDialog(item: MediaItem): void {
    const dialogRef = this.dialog.open(RelatedTvDialogComponent, {
      width: '600px',
      data: { mediaItem: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mediaService.updateMediaTVs(item.id, result.tvs);
      }
    });
  }

  updateDates(item: MediaItem, startDate: Date | null, endDate: Date | null): void {
    const updatedItem = { ...item, startDate, endDate };
    this.mediaService.updateMediaItem(updatedItem);
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Not set';
    return date.toLocaleDateString();
  }

  getTvCount(item: MediaItem): number {
    return item.tvs.length;
  }
}
