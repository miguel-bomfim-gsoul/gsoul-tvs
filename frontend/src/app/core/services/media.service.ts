import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RelatedTv } from './tv.service'

export interface MediaType {
  media_id: number;
  media_name: string;
  url_image: string;
  media_order: number;
  duration_seconds: number;
  related_tvs: RelatedTv[]
  start_time: Date;
  end_time: Date;
  tv_id: number | undefined;
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

  addMedia(mediaData: any): Observable<void> {
    return this.api.post<void>('media', mediaData);
  }

  uploadMedia(file: File): Observable<{ fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post<{ fileName: string }>(`media/upload`, formData);
  }

  getMediaByTv(tvId: string): Observable<MediaByTvResponse[]> {
    return this.api.get<MediaByTvResponse[]>(`media/${tvId}`);
  }

  updateMediaOrder(tv_id: number, media_id: number, newOrder: number): Observable<void> {
    console.log('reponse to back',{
      tv_id,
      media_id,
      newOrder
    })
    return this.api.put<void>(`media/update-order`, {
      tv_id,
      media_id,
      newOrder
    });
  }
}