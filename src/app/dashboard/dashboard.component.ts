import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvPreviewComponent } from './tv-preview/tv-preview.component';
import { TvEditComponent } from './tv-edit/tv-edit.component';

@Component({
  selector: 'app-dashboard',
  imports: [TvPreviewComponent, TvEditComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  constructor(private route: ActivatedRoute) {
  this.route.data.subscribe(data => {
      this.tvs = data['tvs'];
    });
  }

  isEditing: boolean = false;

  tvs?: {
  id: string;
  name: string;
  images: string[];
  }[];

  selectedTvId?: string
  selectedTv?: {
    id: string;
    name: string;
    images: string[];
  }
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  addTv() {
    this.tvs?.push({
      id: `${this.tvs.length + 1}`,
      name: `Nova TV ${(this.tvs.length + 1)}`,
      images: [
        'https://images.unsplash.com/photo-1747607176057-175b357ef4ab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ]
    });
  }

  onSelectTvEdit(id: string) {
    this.selectedTvId = id
    this.toggleEdit()
    this.selectedTv = this.tvs?.find(tv => tv.id === this.selectedTvId);
  }
}