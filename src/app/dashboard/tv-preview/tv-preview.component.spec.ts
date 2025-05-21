import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvPreviewComponent } from './tv-preview.component';

describe('TvPreviewComponent', () => {
  let component: TvPreviewComponent;
  let fixture: ComponentFixture<TvPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
