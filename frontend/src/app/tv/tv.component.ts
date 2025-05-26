import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tv',
  imports: [],
  templateUrl: './tv.component.html',
  styleUrl: './tv.component.css'
})
export class TvComponent implements OnInit, OnDestroy {
  images: string[] = [
    'https://picsum.photos/id/1015/1920/1080',
    'https://picsum.photos/id/1016/1920/1080',
    'https://picsum.photos/id/1018/1920/1080',
    'https://picsum.photos/id/1019/1920/1080',
    'https://picsum.photos/id/1020/1920/1080'
  ];
  currentIndex = 0;
  intervalId: any;
  delay = 10000; // 5 seconds

  ngOnInit() {
    this.startCarousel();
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, this.delay);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
