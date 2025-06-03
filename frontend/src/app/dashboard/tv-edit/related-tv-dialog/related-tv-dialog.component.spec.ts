import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedTvDialogComponent } from './related-tv-dialog.component';

describe('RelatedTvDialogComponent', () => {
  let component: RelatedTvDialogComponent;
  let fixture: ComponentFixture<RelatedTvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedTvDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedTvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
