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
import { environment } from '../../../../environments/environment.development';
import { MediaType, MediaService } from '../../../core/services/media.service';
import { TvType, TvService, RelatedTv } from '../../../core/services/tv.service';
import { RelatedTvDialogComponent } from './related-tv-dialog/related-tv-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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
  selectedTv?: TvType
  related_tvs = signal<RelatedTv[]>([])
  mediaItems: MediaType[] | undefined = []
  displayedColumns: string[] = ['order', 'thumbnail', 'name', 'duration', 'dates', 'tvs', 'actions'];
  dataSource = new MatTableDataSource<MediaType>([]);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  maxFileSizeMB = 5; // Ideal limit
  mediaBaseUrl = environment.apiUrl

  constructor(
    private tvService: TvService,
    private mediaService: MediaService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadTv()

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

onFileUpload(event: any) {
  const file: File = event.target.files[0];

  if (!file) return;
  if (file.size > this.maxFileSizeMB * 1024 * 1024) {
    alert('File size exceeds the limit.');
    return;
  }

  this.mediaService.uploadMedia(file).subscribe({
    next: ({ fileName }) => {
      this.mediaService.addMedia({
        name: file.name,
        media_order: (this.mediaItems?.length ?? 0) + 1,
        duration_seconds: 10,
        start_time: new Date(),
        end_time: null,
        uploadedFileName: fileName,
        tv_id: this.selectedTv?.tv_id
      }).subscribe({
      next: () => {
        this.mediaItems?.push({
          id: 12,
          media_name: file.name,
          url_image: `${this.mediaBaseUrl}/assets/tv-media/${fileName}`,
          media_order: 0,
          duration_seconds: 0,
          related_tvs: [],
          start_time: new Date(),
          end_time: new Date(),
          tv_id: this.selectedTv?.tv_id
        });
        this.dataSource.data = [...(this.mediaItems ?? [])];
        this.cdr.detectChanges();
      },
      complete: () => {this.loadTv()}  
      });
    },
    error: (err) => console.error('File upload failed', err),
  });
}

returnDashboard() {
  this.router.navigate(['/dashboard']);
}

loadTv() {
  this.route.paramMap.subscribe(params => {
    const tv_id = params.get('tv_id');

    if (tv_id) {
      this.tvService.getTvById(Number(tv_id))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (resData) => {
            console.log('tvData', resData);

            this.selectedTv = resData;
            this.mediaItems = resData.medias;
            this.dataSource.data = [...(this.mediaItems ?? [])];
            this.cdr.detectChanges(); // ✅ Force UI update
          }
        });
    }
  });
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
