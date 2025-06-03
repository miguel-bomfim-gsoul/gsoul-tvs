import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AllowedUser {
  user_id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  getAllowedUsers(): Observable<AllowedUser[]> {
    return this.api.get<AllowedUser[]>('users');
  }
}