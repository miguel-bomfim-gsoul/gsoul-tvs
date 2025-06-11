import { Component, OnInit, DestroyRef, signal, ChangeDetectorRef, inject, Injectable, effect } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MediaService, MediasType } from '../../../core/services/media.service'
import { TvService, RelatedTv } from '../../../core/services/tv.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../environments/environment.development';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { RelatedTvDialogComponent } from '../tv-edit/related-tv-dialog/related-tv-dialog.component';
import {MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {Subject} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = '';
  lastPageLabel = $localize`Last page`;
  nextPageLabel = 'Próxima página';
  previousPageLabel = 'Página anterior';

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    
    if (length === 0) {
      return $localize`Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Página ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: 'app-midias',
  imports: [
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}
  ],
  templateUrl: './midias.component.html',
  styleUrl: './midias.component.css'
})

export class MidiasComponent implements OnInit  {
  medias = signal<MediasType[] | undefined>(undefined);
  allMedias = signal<MediasType[] | undefined>(undefined);
  related_tvs = signal<RelatedTv[]>([])
  dataSource = new MatTableDataSource<MediasType>([]);
  displayedColumns: string[] = ['thumbnail', 'name', 'tvs', 'actions'];
  mediaBaseUrl = environment.apiUrl;
  searchControl = new FormControl('');
  filteredMedia = signal<MediasType[] | undefined>([]);
  private cdr = inject(ChangeDetectorRef);
  maxFileSizeMB = 5;
  currentPage = signal(1)
  limitPageSize = signal(15)
  mediasLength: number = 0
  isSearching = signal(false)

  constructor(
    private mediaService: MediaService,
    private tvService: TvService,
    private destroyRef: DestroyRef,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.currentPage.set(params['p']);
      this.loadMedias(this.currentPage(), this.limitPageSize());
    });

    this.loadAllMedias()
  }

  onPageChange(event: PageEvent) {
    this.router.navigate(['/dashboard/midias'], {
      queryParams: {
        p: `${event.pageIndex + 1}`,
      },
    });
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
        this.mediaService.addSingleMedia({
          name: fileName
        }).subscribe({
          next: () => {
            this.loadMedias(this.currentPage(), this.limitPageSize())
            this.loadAllMedias()
          }
        })
      }
    });
  }

  private loadMedias(page?: number, limit?: number) {
    this.mediaService.getAllMedia(page, limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resData) => {
          if(resData.length <= 0 && this.currentPage() > 1) {
                this.router.navigate(['/dashboard/midias'], {
              queryParams: {
                p: `${this.currentPage() - 1}`,
              },
            });
          }
          this.medias.set(resData);
          const mediaRequests = (this.medias() ?? []).map(media =>
              this.loadRelatedTvs(Number(media.media_id)).pipe(
                map(related => ({
                  ...media,
                  related_tvs: related
                }))
              )
            );
            if (mediaRequests.length > 0) {
              forkJoin(mediaRequests)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                  next: (mediaWithRelatedTvs: (MediasType & { related_tvs: RelatedTv[] })[]) => {
                    this.medias.set(mediaWithRelatedTvs);
                        if (this.isSearching()) {
                          this.filteredMedia.set(this.filterItems(this.searchControl.value || ''));
                        } else {
                          this.filteredMedia.set(resData);
                        }
                    this.dataSource.data = [...mediaWithRelatedTvs]; // cria nova referência
                    this.cdr.detectChanges(); // força atualização
                  },
                  error: (err) => console.error('Failed to load related TVs for media:', err)
                });
            } else {
              this.medias.set([]);
              this.filteredMedia.set([]);
              this.dataSource.data = [];
              this.cdr.detectChanges();
            }
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
    });
  }

  // load all medias
    private loadAllMedias() {
    this.mediaService.getAllMedia()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resData) => {
          this.mediasLength = resData.length
          this.allMedias.set(resData);
          const mediaRequests = (this.allMedias() ?? []).map(media =>
              this.loadRelatedTvs(Number(media.media_id)).pipe(
                map(related => ({
                  ...media,
                  related_tvs: related
                }))
              )
            );
            if (mediaRequests.length > 0) {
              forkJoin(mediaRequests)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                  next: (mediaWithRelatedTvs: (MediasType & { related_tvs: RelatedTv[] })[]) => {
                    this.allMedias.set(mediaWithRelatedTvs);
                    this.filteredMedia.set(mediaWithRelatedTvs);
                    this.dataSource.data = [...mediaWithRelatedTvs]; // cria nova referência
                    this.cdr.detectChanges(); // força atualização
                  },
                  error: (err) => console.error('Failed to load related TVs for media:', err)
                });
            } else {
              this.allMedias.set([]);
              this.filteredMedia.set([]);
              this.dataSource.data = [];
              this.cdr.detectChanges();
            }
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
    });
  }

  private loadRelatedTvs(mediaId: number): Observable<RelatedTv[]> {
    return this.tvService.getRelatedTvs(mediaId);
  }

  onInputChange(value: string) {
    this.isSearching.set(value.length > 0);
    
    if (this.isSearching()) {
      this.filteredMedia.set(this.filterItems(value)); // Apply filter to all media
    } else {
      this.filteredMedia.set(this.medias()); // Restore paginated data
    }

    this.dataSource.data = this.filteredMedia()!;
  }

  private filterItems(searchTerm: string): MediasType[] {
    if (!searchTerm.trim()) {
      return this.medias() ?? [];
    }
    
    const term = searchTerm.toLowerCase();
    return (this.allMedias() ?? []).filter(item => item.name.toLowerCase().includes(term));
  }

  openRelatedTvDialog(item: MediasType & { related_tvs?: RelatedTv[] }): void {
      const dialogRef = this.dialog.open(RelatedTvDialogComponent, {
        width: '600px',
        data: { mediaId: item.media_id , relatedTvs: item.related_tvs ?? [] }
      });
  
      dialogRef.afterClosed().subscribe({
        next: () => {this.loadMedias()}
      });
  }

  getTvCount(item: MediasType & { related_tvs?: RelatedTv[] }): number {
    return item.related_tvs?.length ?? 0;
  }

  deleteMedia(media_id: number) {
    this.mediaService.deleteMedia(media_id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.loadMedias(this.currentPage(), this.limitPageSize())
      }
    })
  }
}
