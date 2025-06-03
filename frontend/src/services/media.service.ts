import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaItem } from '../app/types/media-type';
import { TV } from '../app/types/tv-type';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private mediaItems = new BehaviorSubject<MediaItem[]>([
    {
      id: 1,
      name: 'Product Announcement',
      thumbnail: 'https://picsum.photos/id/1/200',
      order: 1,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 15),
      duration: 15,
      progress: 100,
      tvs: [1, 2]
    },
    {
      id: 2,
      name: 'Company Overview',
      thumbnail: 'https://picsum.photos/id/2/200',
      order: 2,
      startDate: new Date(2025, 0, 5),
      endDate: new Date(2025, 0, 20),
      duration: 60,
      progress: 100,
      tvs: [1]
    },
    {
      id: 3,
      name: 'Customer Testimonials',
      thumbnail: 'https://picsum.photos/id/3/200',
      order: 3,
      startDate: new Date(2025, 0, 10),
      endDate: new Date(2025, 0, 25),
      duration: 45,
      progress: 100,
      tvs: [1, 3]
    },
    {
      id: 4,
      name: 'Upcoming Events',
      thumbnail: 'https://picsum.photos/id/4/200',
      order: 4,
      startDate: new Date(2025, 0, 15),
      endDate: new Date(2025, 0, 30),
      duration: 20,
      progress: 100,
      tvs: [1]
    },
    {
      id: 5,
      name: 'Team Introduction',
      thumbnail: 'https://picsum.photos/id/5/200',
      order: 5,
      startDate: new Date(2025, 0, 20),
      endDate: new Date(2025, 1, 5),
      duration: 15,
      progress: 100,
      tvs: [1, 2]
    }
  ]);

  private tvs = new BehaviorSubject<TV[]>([
    { id: 1, name: 'Main Lobby', location: 'Reception Area', isActive: true },
    { id: 2, name: 'Meeting Room A', location: '2nd Floor', isActive: true },
    { id: 3, name: 'Cafeteria', location: '1st Floor', isActive: true },
    { id: 4, name: 'Executive Suite', location: '10th Floor', isActive: false }
  ]);

  getMediaItems(): Observable<MediaItem[]> {
    return this.mediaItems.asObservable();
  }

  getTvs(): Observable<TV[]> {
    return this.tvs.asObservable();
  }

  updateMediaOrder(items: MediaItem[]): void {
    // Update order property based on array index
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    this.mediaItems.next(updatedItems);
  }

  updateMediaItem(item: MediaItem): void {
    const currentItems = this.mediaItems.value;
    const index = currentItems.findIndex(i => i.id === item.id);
    
    if (index !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[index] = item;
      this.mediaItems.next(updatedItems);
    }
  }

  updateMediaTVs(mediaId: number, tvIds: number[]): void {
    const currentItems = this.mediaItems.value;
    const index = currentItems.findIndex(i => i.id === mediaId);
    
    if (index !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[index] = {
        ...updatedItems[index],
        tvs: tvIds
      };
      this.mediaItems.next(updatedItems);
    }
  }
}