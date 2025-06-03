import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TvsPreviewComponent } from './tvs-preview/tvs-preview.component';
import { TvEditComponent } from './tv-edit/tv-edit.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AuthGoogleService } from "../../core/services/auth-google.service";
import { TvService, TvType } from '../../core/services/tv.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [
    TvsPreviewComponent,
    TvEditComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  tvs = signal<TvType[] | undefined>(undefined);
  isFetching = signal<boolean>(false);
  error = signal<string | null>('');
  value = '';
  private destroyRef = inject(DestroyRef);

    constructor(
      public authService: AuthGoogleService,
      private tvService: TvService
    ) {}

  ngOnInit() {
    this.loadTvs()
  }

  private loadTvs() {
    this.isFetching.set(true);
    this.tvService.getAllTvs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resData) => {
          this.tvs.set(resData);
          this.isFetching.set(false);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.error.set('Something went wrong while fetching data');
          this.isFetching.set(false);
        }
      });
  }

  isEditing: boolean = false;
  selectedTvId?: string
  selectedTv?: TvType
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  addTv() {
    const newTv = {
      name: 'New TV',
      tv_slug: 'new-tv'
    };

    this.tvService.createTv(newTv)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadTvs();
        },
        error: (error) => {
          console.error('Error adding TV:', error);
          this.error.set('Something went wrong while adding TV');
        }
      });
  }

  onSelectTvEdit(id: string) {
    this.selectedTvId = id
    this.toggleEdit()
    this.selectedTv = this.tvs()?.find(tv => tv.id === Number(this.selectedTvId));
  }

  onSelectTvDelete(id: string) {
    this.tvService.deleteTv(Number(id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadTvs();
        },
        error: (error) => {
          console.error('Error deleting TV:', error);
          this.error.set('Something went wrong while deleting TV');
        }
      });
  }
}