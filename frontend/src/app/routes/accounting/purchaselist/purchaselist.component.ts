import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core';
import { product } from '@shared/models/product';
import { EasyColumn } from '@shared';
import { EasyDialog } from '@shared';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { DeleteConfirmationDialog } from '@shared/components/deleteconfimationdialog/deleteconfirmationdialog.component';
import { element } from 'protractor';
import { Router } from '@angular/router';
import { AccountingService } from '@core/services/httpServices/accounting.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './purchaselist.component.html',
})
export class PurchaseListComponent implements OnInit {
  model:product[];
  selectedobject;
  constructor(
    private httpService:HttpService,
    private accountingService:AccountingService,
    private matsnackbar: MatSnackBar,
    public dialog: MatDialog,
    private easyDialog: EasyDialog,private router :Router) {}
  ngOnInit() {
    this.getpagedata();
  }
  async getpagedata()
  {
    var result = await this.accountingService.accountingpurchaseget();
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
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        
      }
    });
  }
}

