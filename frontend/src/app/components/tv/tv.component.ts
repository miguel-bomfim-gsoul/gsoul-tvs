import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from '../../core/services/media.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tv',
  imports: [],
  templateUrl: './tv.component.html',
  styleUrl: './tv.component.css'
})
export class TvComponent implements OnInit {
  images = signal<string[]>([]);

  currentIndex = 0;
  intervalId: any;
  delay = 5000;
  private destroyRef = inject(DestroyRef)
  private route = inject(ActivatedRoute);

  constructor(
    private mediaService: MediaService
  ) {}

  startCarousel() {
  this.intervalId = setInterval(() => {  
    this.currentIndex = (this.currentIndex + 1) % this.images().length;
  }, this.delay);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tv_id = params.get('tv_id');

      if (tv_id) {
        this.mediaService.getMediaByTv(tv_id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (resData) => {
              this.images.set(resData.map(image => image.url_image));
            },
            complete: () => {
              this.startCarousel();
            }
        });
      }
    });
  }
}
