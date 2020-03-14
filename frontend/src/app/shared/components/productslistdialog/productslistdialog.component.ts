import { Component, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../easy-dialog/easy-dialog.config';

@Component({
  selector: 'app-mainpanel-deleteconfirmationdialog',
  templateUrl: 'productslistdialog.html',
})
export class ProductsListDialog {

  constructor(
    public dialogRef: MatDialogRef<ProductsListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
