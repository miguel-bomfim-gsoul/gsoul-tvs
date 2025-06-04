import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TvsPreviewComponent } from './tvs-preview/tvs-preview.component';
import { TvEditComponent } from './tv-edit/tv-edit.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AuthGoogleService } from "../../core/services/auth-google.service";
import { TvService, TvType } from '../../core/services/tv.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [
    TvsPreviewComponent,
    TvEditComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  tvs = signal<TvType[] | undefined>(undefined);
  filteredTvs = signal<TvType[] | undefined>([]);
  isFetching = signal<boolean>(false);
  error = signal<string | null>('');
  searchError = signal<string | null>('');
  searchControl = new FormControl('');
  private destroyRef = inject(DestroyRef);

  constructor(
    public authService: AuthGoogleService,
    private tvService: TvService
  ) {}

  ngOnInit() {
    this.loadTvs()
  }

  onInputChange(value: string) { 
    this.filteredTvs.set(this.filterItems(value))

    if(this.filterItems(value).length <= 0) {
      this.searchError.set('Tv não encontrada')
    } else {
      this.searchError.set('')
    }
  }

  private filterItems(searchTerm: string): TvType[] {
    if (!searchTerm.trim()) {
      return this.tvs() ?? [];
    }
    
    const term = searchTerm.toLowerCase();
    return (this.tvs() ?? []).filter(item =>item.tv_name.toLowerCase().includes(term));
  }

  private loadTvs() {
    this.isFetching.set(true);
    this.tvService.getAllTvs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resData) => {
          this.tvs.set(resData);
          this.filteredTvs.set(resData)
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
      name: 'New TV'
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
    this.searchControl.setValue('')
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