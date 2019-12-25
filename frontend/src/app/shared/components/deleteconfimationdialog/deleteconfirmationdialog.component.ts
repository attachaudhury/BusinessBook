import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mainpanel-deleteconfirmationdialog',
  templateUrl: 'deleteconfirmationdialog.html',
})
export class DeleteConfirmationDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialog>) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
