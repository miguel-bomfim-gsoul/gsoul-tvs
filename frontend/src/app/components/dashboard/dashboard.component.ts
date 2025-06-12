import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TvsPreviewComponent } from './tvs-preview/tvs-preview.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthGoogleService } from "../../core/services/auth-google.service";
import { TvService, TvType } from '../../core/services/tv.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  imports: [
    TvsPreviewComponent,
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
  isEditing: boolean = false;
  selectedTvId?: string
  selectedTv?: TvType
  createdTvId: number = 0

  constructor(
    public authService: AuthGoogleService,
    private tvService: TvService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTvs()
  }

  onInputChange(value: string) { 
    this.filteredTvs.set(this.filterItems(value))
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

          const newTv = this.tvs()?.find(tv => tv.tv_id === this.createdTvId);
          console.log('newTv', newTv)
          if (newTv) {
            this.selectedTv = newTv;
            setTimeout(() => {
              this.selectedTv = undefined;
            }, 500);
          }
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.error.set('Something went wrong while fetching data');
          this.isFetching.set(false);
        }
      });
  }
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  addTv() {
    const newTv = {
      name: 'Nova TV'
    };

    this.tvService.createTv(newTv)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.createdTvId = res.tv_id
          this.loadTvs();
        },
        error: (error) => {
          console.error('Error adding TV:', error);
          this.error.set('Something went wrong while adding TV');
        }
      });
  }

  onSelectTvEdit(id: string) {
    this.router.navigate(['/dashboard/edit', id]);
    this.selectedTvId = id
    this.selectedTv = this.tvs()?.find(tv => tv.tv_id === Number(this.selectedTvId));
    this.searchControl.setValue('')
  }

  onSelectTvDelete(id: string) {
    this.createdTvId = 0
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