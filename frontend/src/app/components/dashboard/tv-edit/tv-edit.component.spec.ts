import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvEditComponent } from './tv-edit.component';

describe('TvEditComponent', () => {
  let component: TvEditComponent;
  let fixture: ComponentFixture<TvEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
