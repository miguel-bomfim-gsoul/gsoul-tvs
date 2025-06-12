import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RelatedTv } from './tv.service'

export interface MediaType {
  media_id?: number;
  media_name: string;
  url_image: string;
  media_order: number;
  duration_seconds: number;
  related_tvs: RelatedTv[]
  start_time: Date | null;
  end_time: Date | null;
  tv_id: number | undefined;
  is_active?: 0 | 1
}

export interface MediaByTvResponse {
  url_image: string;
  duration_seconds: string;
}

export interface MediasType {
  media_id: string;
  name: string;
  url_image: string;
  tv_id: string;
  start_time: Date;
  end_time: Date;
  related_tvs?: RelatedTv[]
}

export interface MediaAddByTvType {
  media_id: number;
  tv_ids: number[];
  unselectedTvsIds: number[];
}

@Injectable({
  providedIn: 'root'
})

export class MediaService {
  constructor(private api: ApiService) {}

  getAllMedia(page?: number, limit?: number): Observable<MediasType[]> {
    const p = page ? page : 1
    let requestUrl = 'media/medias'

    if(p && limit) {
      requestUrl += `?p=${p}&limit=${limit}`
    }

    return this.api.get<MediasType[]>(requestUrl);
  }

  addMultipleMediaToTv(mediaData: {
    mediaFiles: { name: string; uploadedFileName: string; media_order?: number; duration_seconds?: number }[],
    tv_id: number,
    start_time?: Date | null,
    end_time?: Date | null
  }): Observable<any> {
    return this.api.post('media', mediaData);
  }
  
  relateMediaTv(mediaTvData: MediaAddByTvType): Observable<any> {
    return this.api.post<any>('media/relate', mediaTvData);
  }
  
  addMultipleMedia(fileNames: string[]): Observable<void> {
    console.log('files', fileNames)
    return this.api.post<void>('media/add', {fileNames});
  }

  uploadMedia(files: File[]): Observable<{ fileNames: string[] }> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.api.post<{ fileNames: string[] }>(`media/upload`, formData);
  }

  getMediaByTv(tvId: string): Observable<MediaByTvResponse[]> {
    return this.api.get<MediaByTvResponse[]>(`media/${tvId}`);
  }

  updateMediaOrder(tv_id: number, media_id: number, newOrder: number): Observable<void> {
    return this.api.put<void>(`media/update-order`, {
      tv_id,
      media_id,
      newOrder
    });
  }

  updateMediaDate(tv_id: number | undefined, media_id: number | undefined, payload: { start_time?: Date, end_time?: Date | null }) {
    return this.api.put('media/update-date', {
      ...payload,
      media_id,
      tv_id
    });
  }

  deleteMedia(media_id: number): Observable<void> {
    return this.api.delete<void>(`media/delete/${media_id}`);
  }
}