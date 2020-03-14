import { Component, OnInit, Inject } from '@angular/core';
import { product } from '@shared/models/product';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AccountingService } from '@core/services/httpServices/accounting.service';
import { DialogData } from '@shared/components/easy-dialog/easy-dialog.config';
import { ProductsListDialog } from '@shared/components/productslistdialog/productslistdialog.component';
@Component({
  selector: 'app-accounting-saleslist',
  templateUrl: './saleslist.component.html',
})
export class SalesListComponent implements OnInit {
  model:product[];
  selectedobject;
  constructor(
    private accountingService:AccountingService,
    public dialog: MatDialog,) {}
  ngOnInit() {
    this.getpagedata();
  }
  async getpagedata()
  {
    var result = await this.accountingService.accountingpossaleget();
    console.log('loaded getpagedata');
      console.log(result);
      if(result["status"]=="success")
      {
       this.model =  result["data"];
      }
  }
  print(item) {
    this.selectedobject = item;
  }
  async details(item) {
    this.selectedobject = item;
    console.log(this.selectedobject);
    const dialogRef = this.dialog.open(ProductsListDialog, {
      width: '50em',
      data:this.selectedobject.products
    });
    dialogRef.afterClosed().subscribe(async (result) => {

    });
  }
}

