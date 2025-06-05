import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaService, MediaByTvResponse } from '../../core/services/media.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-tv',
  imports: [],
  templateUrl: './tv.component.html',
  styleUrl: './tv.component.css'
})
export class TvComponent implements OnInit {
  medias = signal<MediaByTvResponse[]>([]);
  currentIndex = 0;
  intervalId: any;
  private destroyRef = inject(DestroyRef)
  private route = inject(ActivatedRoute);
  mediaBaseUrl = environment.apiUrl

  constructor(
    private mediaService: MediaService
  ) {}

  startCarousel() {
    const runCarousel = () => {
      const mediasArray = this.medias();
      if (!mediasArray.length) return;

      const currentMedia = mediasArray[this.currentIndex];
      const duration = (Number(currentMedia.duration_seconds)) * 1000;
      this.intervalId = setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % mediasArray.length;
        runCarousel();
      }, duration);
    }

    runCarousel()

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tv_id = params.get('tv_id');

      if (tv_id) {
        this.mediaService.getMediaByTv(tv_id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (resData) => {
              this.medias.set(resData);
            },
            complete: () => {
              this.startCarousel();
            }
        });
      }
    });
  }
}
