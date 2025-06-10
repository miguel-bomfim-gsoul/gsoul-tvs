import { Component, OnInit, DestroyRef, signal, ChangeDetectorRef, inject } from '@angular/core';
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
    MatDialogModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './midias.component.html',
  styleUrl: './midias.component.css'
})

export class MidiasComponent implements OnInit {
  medias = signal<MediasType[] | undefined>(undefined);
  related_tvs = signal<RelatedTv[]>([])
  dataSource = new MatTableDataSource<MediasType>([]);
  displayedColumns: string[] = ['thumbnail', 'name', 'tvs', 'actions'];
  mediaBaseUrl = environment.apiUrl;
  searchControl = new FormControl('');
  filteredMedia = signal<MediasType[] | undefined>([]);
  private cdr = inject(ChangeDetectorRef);
  maxFileSizeMB = 5;

  constructor(
    private mediaService: MediaService,
    private tvService: TvService,
    private destroyRef: DestroyRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadMedias()
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
          next: () => { this.loadMedias() }
        })
      },
      complete: () => { this.loadMedias() }
    });
  }

  private loadMedias() {
    this.mediaService.getAllMedia()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resData) => {
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
                    this.filteredMedia.set(mediaWithRelatedTvs);
                    this.dataSource.data = [...mediaWithRelatedTvs]; // cria nova referência
                    this.cdr.detectChanges(); // força atualização
                  },
                  error: (err) => console.error('Failed to load related TVs for media:', err)
                });
            } else {
              // Nenhuma mídia para processar
              this.medias.set([]);
              this.filteredMedia.set([]);
              this.dataSource.data = [];
              this.cdr.detectChanges(); // Força renderização correta da tabela
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
    this.filteredMedia.set(this.filterItems(value))
    this.dataSource.data = this.filteredMedia()!
  }

  private filterItems(searchTerm: string): MediasType[] {
    if (!searchTerm.trim()) {
      return this.medias() ?? [];
    }
    
    const term = searchTerm.toLowerCase();
    return (this.medias() ?? []).filter(item => item.name.toLowerCase().includes(term));
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
      next: (resData) => {
        this.loadMedias()
      }
    })
  }
}
