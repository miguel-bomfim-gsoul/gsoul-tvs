import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MediaType } from "./media.service"

export interface TvType {
  id: number;
  name: string;
  tv_slug: string;
  images?: MediaType[];
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