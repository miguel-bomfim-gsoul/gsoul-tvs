import { Component, Inject, DestroyRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TvService } from '../../../core/services/tv.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tv-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './tv-delete-dialog.component.html',
  styleUrl: './tv-delete-dialog.component.css'
})
export class TvDeleteDialogComponent {
  currentTv: number

    constructor(
      public dialogRef: MatDialogRef<TvDeleteDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {tv_id: number},
      private tvService: TvService,
      private destroyRef: DestroyRef
    ) {
      this.currentTv = data.tv_id
    }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickDeleteTv() {
    this.tvService.deleteTv(Number(this.currentTv))
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.dialogRef.close({ deleted: true });
      },
      error: (error) => {
        console.error('Error deleting TV:', error);
        this.dialogRef.close();
      }
    });
  }
}
