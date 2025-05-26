import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  delay = 3000;
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef)
  private route = inject(ActivatedRoute);

  startCarousel() {
  this.intervalId = setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.images().length;
  }, this.delay);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('tv_slug');

      if (slug) {
        const subscription = this.httpClient
          .get<{ url: string }[]>(`http://localhost:3000/media/${slug}`)
          .subscribe({
            next: (resData) => {
              this.images.set(resData.map(image => image.url));
            },
            complete: () => {
              this.startCarousel();
            }
          });

        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
          clearInterval(this.intervalId);
        });
      }
    });
  }
}
