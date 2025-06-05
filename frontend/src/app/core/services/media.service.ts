import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RelatedTv } from './tv.service'

export interface MediaType {
  id: number;
  media_name: string;
  url_image: string;
  media_order: number;
  duration_seconds: number;
  related_tvs: RelatedTv[]
  start_time: Date;
  end_time: Date;
}

export interface MediaByTvResponse {
  url_image: string;
  duration_seconds: string;
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

  // fix it here and in the backend
  updateMediaOrder(media_id: number, tv_id: number, media_order: number): Observable<void> {
    return this.api.put<void>(`media/update-order`, {
      media_id,
      tv_id,
      media_order
    });
  }
}