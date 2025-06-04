import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface MediaType {
  id: number;
  media_name: string;
  url_image: string;
  media_order: number;
  duration_seconds: number;
  start_time: Date;
  end_time: Date;
}

export interface MediaByTvResponse {
  url_image: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  constructor(private api: ApiService) {}

  addMedia(media: Partial<MediaType>): Observable<{ id: number }> {
    return this.api.post<{ id: number }>('media', media);
  }

  getMediaByTv(tvId: string): Observable<MediaByTvResponse[]> {
    return this.api.get<MediaByTvResponse[]>(`media/${tvId}`);
  }

  updateMediaOrder(mediaId: number, newOrder: number): Observable<void> {
    return this.api.put<void>(`media/${mediaId}/order`, { media_order: newOrder });
  }
}