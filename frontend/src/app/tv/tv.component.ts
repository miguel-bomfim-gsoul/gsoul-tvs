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
      const id = params.get('name');

      if (id) {
        const subscription = this.httpClient
          .get<{ url_image: string }[]>(`http://localhost:3000/media/${id}`)
          .subscribe({
            next: (resData) => {
              this.images.set(resData.map(image => image.url_image));
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
