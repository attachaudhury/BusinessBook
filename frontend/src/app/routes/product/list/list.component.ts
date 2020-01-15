import { Component, OnInit } from '@angular/core';
import { HttpService } from '@core';
import { category } from '@shared/models/category';
import { EasyColumn } from '@shared';
import { EasyDialog } from '@shared';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { DeleteConfirmationDialog } from '@shared/components/deleteconfimationdialog/deleteconfirmationdialog.component';
import { element } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  categories:category[];
  selectedobject;
  constructor(
    private httpService:HttpService,
    private matsnackbar: MatSnackBar,
    public dialog: MatDialog,
    private easyDialog: EasyDialog,private router :Router) {}
  ngOnInit() {
    this.getcategories();
  }
  getcategories()
  {
    this.httpService.categoryget().then(res => {
      if(res.status=="success")
      {
       this.categories =  this.flattreesarray(res.data);
      }
    });
  }
  flattreesarray(treesarray){
    var flattedtree = [];
    function recusrive(el)
    {
      flattedtree.push(el);
      if(el["children"]){
        el["children"].forEach(child => {
          child.name = el.name+" > "+child.name;
          recusrive(child);
        });
      }
    }
    treesarray.forEach(element => {
      recusrive(element);
    });
    return flattedtree;
  }

  edit(item) {
    this.selectedobject = item;
    this.router.navigate(['/category/edit',this.selectedobject._id]);
  }
  async delete(item) {
    if(item["children"])
    {
      this.matsnackbar.open("Alert! Category has children, can't be deleted","Close",{duration:3000})
      return false;
    }
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
          this.matsnackbar.open("Operation Successful", 'Close', {
            duration: 6000,
          });
          this.getcategories();
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

