import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvsPreviewComponent } from './tvs-preview.component';

describe('TvPreviewComponent', () => {
  let component: TvsPreviewComponent;
  let fixture: ComponentFixture<TvsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvsPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
