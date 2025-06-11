import { Component, DestroyRef, OnInit, ChangeDetectorRef, inject, signal } from '@angular/core';
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
  displayedColumns: string[] = ['order', 'thumbnail', 'name','tvs', 'duration' , 'dates', 'actions'];
  dataSource = new MatTableDataSource<MediaType>([]);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  maxFileSizeMB = 5;
  mediaBaseUrl = environment.apiUrl

  constructor(
    private tvService: TvService,
    private mediaService: MediaService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadMedias()
  }

  openTv() {
    window.open(`/tv/${this.selectedTv?.tv_id}`, '_blank'); 
  }

  onFileUpload(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = Array.from(files).filter(file => {
      if (file.size > this.maxFileSizeMB * 1024 * 1024) {
        alert(`File ${file.name} exceeds the size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    this.mediaService.uploadMedia(validFiles).subscribe({
      next: ({ fileNames }) => {
        const mediaItemsPayload = fileNames.map((fileName, index) => ({
          name: validFiles[index].name,
          uploadedFileName: fileName,
          media_order: (this.mediaItems?.length ?? 0) + index + 1,
          duration_seconds: 10
        }));

        this.mediaService.addMultipleMediaToTv({
          mediaFiles: mediaItemsPayload,
          tv_id: this.selectedTv?.tv_id!,
          start_time: new Date(),
          end_time: null
        }).subscribe({
          next: () => {
            this.loadMedias();
          },
          error: err => console.error('Failed to insert media to TV:', err)
        });
      },
      error: err => console.error('Upload failed:', err)
    });
  }

returnDashboard() {
  this.router.navigate(['/dashboard']);
}

loadMedias() {
  this.route.paramMap.subscribe(params => {
    const tv_id = params.get('tv_id');

    if (tv_id) {
      this.tvService.getTvById(Number(tv_id))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (resData) => {
            this.selectedTv = resData;
            this.mediaItems = resData.medias;
            this.dataSource.data = [...(this.mediaItems ?? [])];
            this.cdr.detectChanges(); // ✅ Force UI update
          },
          complete: () => {
            if (this.selectedTv && this.selectedTv.medias) {
              const sortedMedias = this.selectedTv.medias.sort((a, b) => a.media_order - b.media_order);

              const mediaRequests = sortedMedias
                .filter(media => media.media_id !== undefined)
                .map(media =>
                  this.loadRelatedTvs(media.media_id as number).pipe(
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
        });
    }
  });
}

  private loadRelatedTvs(mediaId: number): Observable<RelatedTv[]> {
    return this.tvService.getRelatedTvs(mediaId);
  }

  onMediaOrderBlur(event: FocusEvent | Event, item: MediaType) {
    const target = event.target as HTMLInputElement;
    const newOrder = parseInt(target.value);

    if (!isNaN(newOrder) && newOrder !== item.media_order) {
      if (item.media_id !== undefined) {
        this.mediaService.updateMediaOrder(this.selectedTv!.tv_id, item.media_id, newOrder)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              item.media_order = newOrder;
            },
            complete: () => {
              this.loadMedias()
            },
            error: (err) => console.error('Error updating media order:', err)
          });
      } else {
        console.error('media_id is undefined for item:', item);
      }
    }
  }

  onDrop(event: CdkDragDrop<MediaType[]>): void {    
    moveItemInArray(this.dataSource.data ?? [], event.previousIndex, event.currentIndex);
    this.mediaService.updateMediaOrder(this.selectedTv!.tv_id, event.item.data.media_id, event.currentIndex + 1)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: (err) => console.error('Error updating media order:', err)
        });
    this.dataSource.data = this.dataSource.data.map((item, index) => ({
      ...item,
      media_order: index + 1
    }));
  }

  openRelatedTvDialog(item: MediaType & { related_tvs?: RelatedTv[] }): void {
    const dialogRef = this.dialog.open(RelatedTvDialogComponent, {
      width: '600px',
      data: { mediaId: item.media_id , relatedTvs: item.related_tvs ?? [] }
    });

    dialogRef.afterClosed().subscribe({
      next: () => {
        this.loadMedias()
      }
    });
  }

  updateStartDate(item: MediaType, startDate: Date | null): void {
    if (!startDate) return;

    this.mediaService.updateMediaDate(this.selectedTv?.tv_id, item.media_id, { start_time: startDate }).subscribe({
      error: err => console.error(err)
    });
  }

  updateEndDate(item: MediaType, endDate: Date | null): void {
    if (!endDate) return;

    this.mediaService.updateMediaDate(this.selectedTv?.tv_id, item.media_id, { end_time: endDate }).subscribe({
      next: () => {
        this.loadMedias()
      },
      error: err => console.error(err)
    });
  }

  formatDate(date: Date | null) {
    if (!date) return null;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',  
      minute: '2-digit'
    }).format(new Date(date));
  }

  getTvCount(item: MediaType & { related_tvs?: RelatedTv[] }): number {
    return item.related_tvs?.length ?? 0;
  }
}
