import { Component, DestroyRef, OnInit, Input, ChangeDetectorRef, inject, signal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { MediaType, MediaService } from '../../../core/services/media.service';
import { TvType, TvService, RelatedTv } from '../../../core/services/tv.service';
import { RelatedTvDialogComponent } from './related-tv-dialog/related-tv-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tv-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
  templateUrl: './tv-edit.component.html',
  styleUrl: './tv-edit.component.css'
})

export class TvEditComponent implements OnInit {
  @Input({ required: true }) selectedTv?: TvType
  related_tvs = signal<RelatedTv[]>([])
  mediaItems: MediaType[] | undefined = []
  displayedColumns: string[] = ['order', 'thumbnail', 'name', 'duration', 'dates', 'tvs', 'actions'];
  dataSource = new MatTableDataSource<MediaType>([]);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private tvService: TvService,
    private mediaService: MediaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.selectedTv?.medias) {
      const sortedMedias = this.selectedTv.medias.sort((a, b) => a.media_order - b.media_order);

      const mediaRequests = sortedMedias.map(media =>
        this.loadRelatedTvs(media.id).pipe(
          map(related => ({
            ...media,
            related_tvs: related
          }))
        )
      );

      forkJoin(mediaRequests)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (mediaWithRelatedTvs: (MediaType & { related_tvs: RelatedTv[] })[]) => {
            this.mediaItems = mediaWithRelatedTvs;
            this.dataSource = new MatTableDataSource(mediaWithRelatedTvs);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Failed to load related TVs for media:', err)
        });
    }
  }

  private loadRelatedTvs(mediaId: number): Observable<RelatedTv[]> {
    return this.tvService.getRelatedTvs(mediaId);
  }

  onMediaOrderBlur(event: FocusEvent, item: MediaType) {
    // const target = event.target as HTMLInputElement;
    // const newOrder = parseInt(target.value);

    // if (!isNaN(newOrder) && newOrder !== item.media_order) {
    //   this.mediaService.updateMediaOrder(item.id, this.selectedTv!.id, newOrder)
    //     .pipe(takeUntilDestroyed(this.destroyRef))
    //     .subscribe({
    //       next: () => {
    //         item.media_order = newOrder;
    //       },
    //       error: (err) => console.error('Error updating media order:', err)
    //     });
    // }
  }

  onDrop(event: CdkDragDrop<MediaType[]>): void {
    moveItemInArray(this.mediaItems ?? [], event.previousIndex, event.currentIndex);
    // this.mediaService.updateMediaOrder(this.mediaItems);
  }

  openRelatedTvDialog(item: MediaType & { related_tvs?: RelatedTv[] }): void {
    const dialogRef = this.dialog.open(RelatedTvDialogComponent, {
      width: '600px',
      data: { mediaItem: item.related_tvs ?? [] } // ← envia os related_tvs reais
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.mediaService.updateMediaTVs(item.id, result.tvs);
      }
    });
  }

  updateDates(item: MediaType, startDate: Date | null, endDate: Date | null): void {
    const updatedItem = { ...item, startDate, endDate };
    // this.mediaService.updateMediaItem(updatedItem);
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Not set';
    return date.toLocaleDateString();
  }

  getTvCount(item: MediaType & { related_tvs?: RelatedTv[] }): number {
    return item.related_tvs?.length ?? 0;
  }
}
