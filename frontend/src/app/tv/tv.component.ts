import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tv',
  imports: [],
  templateUrl: './tv.component.html',
  styleUrl: './tv.component.css'
})
export class TvComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
        this.tvs = data['tvs'];
      });
  }
  tvName!: string;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.tvName = params.get('name')!;
    });
  }

  tvs?: {
    id: string;
    name: string;
    images: string[];
  }[];

}
