import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TvsPreviewComponent } from './tvs-preview/tvs-preview.component';
import { TvEditComponent } from './tv-edit/tv-edit.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

interface MediaType {
  id: number
  url_image: string
  media_order: number
}

interface TvType {
  id: number
  name: string
  tv_slug: string
  images?: MediaType[]
}

@Component({
  selector: 'app-dashboard',
  imports: [TvsPreviewComponent, TvEditComponent, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  tvs = signal<TvType[] | undefined>(undefined);
  isFetching = signal<boolean>(false);
  error = signal<string | null>('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<TvType[]>('http://localhost:3000/tvs').subscribe({
      next: (resData) => {
        this.tvs.set(resData);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.error.set('! Something went wrong while fetching data !');
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  isEditing: boolean = false;

  selectedTvId?: string
  selectedTv?: TvType
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  reqBody = {
    name: 'teste'
  }

  addTv() {
    this.httpClient.post('http://localhost:3000/tvs', this.reqBody)
      .subscribe({
        next: (resData) => {
          console.log('TV added successfully:', resData);
          this.ngOnInit(); // Refresh the list after adding a new TV
        },
        error: (error) => {
          console.error('Error adding TV:', error);
          this.error.set('! Something went wrong while adding TV !');
        }
      });
  }

  onSelectTvEdit(id: string) {
    this.selectedTvId = id
    this.toggleEdit()
    this.selectedTv = this.tvs()?.find(tv => tv.id === Number(this.selectedTvId));
  }
}