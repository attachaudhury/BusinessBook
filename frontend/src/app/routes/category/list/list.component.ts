import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core';
import { category } from '@shared/models/category';
import { EasyColumn } from '@shared';
import { EasyDialog } from '@shared';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { DeleteConfirmationDialog } from '@shared/components/deleteconfimationdialog/deleteconfirmationdialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  categories:category[];
  selectedobject;
  constructor(
    private httpService:HttpService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private easyDialog: EasyDialog) {}
  ngOnInit() {
    this.getcategories();
  }
  getcategories()
  {
    this.httpService.categoryget().then(res => {
      if(res.status=="success")
      {
        this.categories = res.data
      }
    });
  }
  edit(item) {

    // if (this.loggedinuser.role == "agency" && user.role == "agency") {
    //   this._snackBar.open("You can't delete this account", 'OK', { duration: 3000, });
    //   return;
    // }
    // if (user.username == "admin") {
    //   this._snackBar.open("You can't delete this account", 'OK', { duration: 3000, });
    //   return;
    // }
    // this.usertodelete = user;
    
  }
  async delete(item) {
    this.selectedobject = item;
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var res  = await this.httpService.categorydelete({_id:this.selectedobject._id});
        console.log(res);
        if(res["status"]=="success")
        {
          this._snackBar.open("Operation Successful", 'Close', {
            duration: 6000,
          });
          this.getcategories();
        }
        else{
          this._snackBar.open("Operation Failed", 'Close', {
            duration: 6000,
          });
        }
      }
    });
  }
}

