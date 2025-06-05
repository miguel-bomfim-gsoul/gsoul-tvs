import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MediaType } from "./media.service"

export interface TvType {
  id: number;
  tv_name: string;
  tv_slug: string;
  medias?: MediaType[];
}

export interface RelatedTv {
  tv_id: number
  media_order: number
}

export interface CreateTvResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TvService {
  constructor(private api: ApiService) {}

  getAllTvs(): Observable<TvType[]> {
    return this.api.get<TvType[]>('tvs');
  }

  getRelatedTvs(id: number): Observable<RelatedTv[]> {
    return this.api.get<RelatedTv[]>(`tvs/related/${id}`);
  }

  getTvById(id: number): Observable<TvType> {
    return this.api.get<TvType>(`tvs/${id}`);
  }

  createTv(tv: { name: string }): Observable<CreateTvResponse> {
    return this.api.post<CreateTvResponse>('tvs', tv);
  }

  deleteTv(id: number): Observable<string> {
    return this.api.delete<string>(`tvs/${id}`);
  }
}