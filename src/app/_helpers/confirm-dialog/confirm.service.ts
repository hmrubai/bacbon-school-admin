import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { ConfirmComponent } from './confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable()
export class ConfirmService {

  private dialogRef: MatDialogRef<ConfirmComponent>;

  constructor(private dialog: MatDialog) { }

  public confirm(title: string, message: string, confirmButtonText?: string, disableClose?: boolean): Observable<any> {

    this.dialogRef = this.dialog.open(ConfirmComponent, { disableClose: true });
    this.dialogRef.componentInstance.title = title;
    this.dialogRef.componentInstance.message = message;
    if (confirmButtonText) this.dialogRef.componentInstance.confirmButtonText = confirmButtonText;
    if (disableClose) this.dialogRef.componentInstance.disableCloseButton = disableClose;

    return this.dialogRef.afterClosed();

  }
}
