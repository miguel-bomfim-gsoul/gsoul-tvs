import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvDeleteDialogComponent } from './tv-delete-dialog.component';

describe('TvDeleteDialogComponent', () => {
  let component: TvDeleteDialogComponent;
  let fixture: ComponentFixture<TvDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
