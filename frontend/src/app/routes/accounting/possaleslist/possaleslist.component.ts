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

@Component({
  selector: 'app-category-list',
  templateUrl: './possaleslist.component.html',
})
export class PosSalesListComponent implements OnInit {
  model:product[];
  selectedobject;
  constructor(
    private httpService:HttpService,
    private matsnackbar: MatSnackBar,
    public dialog: MatDialog,
    private easyDialog: EasyDialog,private router :Router) {}
  ngOnInit() {
    this.getpagedata();
  }
  getpagedata()
  {
    this.httpService.productget().then(res => {
      console.log('loaded getpagedata');
      console.log(res);
      if(res["status"]=="success")
      {
       this.model =  res["data"];
      }
    });
  }

  edit(item) {
    this.selectedobject = item;
    this.router.navigate(['/product/edit',this.selectedobject._id]);
  }
  async delete(item) {
    this.selectedobject = item;
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var res  = await this.httpService.productdelete({_id:this.selectedobject._id});
        console.log(res);
        if(res["status"]=="success")
        {
          this.matsnackbar.open("Operation Successful", 'Close', {
            duration: 6000,
          });
          this.getpagedata();
        }
        else{
          this.matsnackbar.open("Operation Failed", 'Close', {
            duration: 6000,
          });
        }
      }
    });
  }
}

