
import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class ConfirmComponent {

  public title: string;
  public message: string;
  public confirmButtonText: string = 'Confirm';
  public cancelButtonText: string = 'Cancel';
  public disableCloseButton: boolean = false;

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>) {
    this.dialogRef.addPanelClass('p-0');
  }

}