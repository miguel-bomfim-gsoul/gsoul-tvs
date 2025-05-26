import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
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
  selector: 'app-tv-edit',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tv-edit.component.html',
  styleUrl: './tv-edit.component.css'
})
export class TvEditComponent {
  @Input({ required: true }) selectedTv?: TvType

  relatedTvs = new FormControl('');
  relatedTvsOrder = new FormControl('');
  tvsList: string[] = ['Recursos Humanos', 'Marketing', 'Tech', 'Teste 1', 'Teste 2'];
  ordens: string[] = ["1", "2", "3", "4", "5"];

}
