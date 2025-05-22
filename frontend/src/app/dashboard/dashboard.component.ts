import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TvsPreviewComponent } from './tvs-preview/tvs-preview.component';
import { TvEditComponent } from './tv-edit/tv-edit.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

interface MediaType {
  id: number
  url_image: string
  media_order: number
}

interface TvType {
  id: number
  name: string
  images?: MediaType[]
}

@Component({
  selector: 'app-dashboard',
  imports: [TvsPreviewComponent, TvEditComponent, MatProgressSpinnerModule],
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

  // addTv() {
  //   this.tvs?.push({
  //     id: `${this.tvs.length + 1}`,
  //     name: `Nova-TV-${(this.tvs.length + 1)}`,
  //     images: [
  //       'https://images.unsplash.com/photo-1747607176057-175b357ef4ab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     ]
  //   });
  // }

  onSelectTvEdit(id: string) {
    this.selectedTvId = id
    this.toggleEdit()
    this.selectedTv = this.tvs()?.find(tv => tv.id === Number(this.selectedTvId));
  }
}