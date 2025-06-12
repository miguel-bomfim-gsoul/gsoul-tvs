import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MediaType } from "./media.service"

export interface TvType {
  tv_id: number;
  tv_name: string;
  tv_slug: string;
  medias?: MediaType[];
}

export interface RelatedTv {
  tv_id: number
  media_order: number
  name: string
}

export interface CreateTvResponse {
  status: string;
  tv_id: number
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

  updateName(newNameData: {name: string, tv_id: number}): Observable<void> {
    return this.api.put<void>('tvs/name', newNameData);
  }

  deleteTv(id: number): Observable<string> {
    return this.api.delete<string>(`tvs/${id}`);
  }
}