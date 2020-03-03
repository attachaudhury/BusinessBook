import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { category } from '@shared/models/category';
import { product } from '@shared/models/product';
import { MatSnackBar } from '@angular/material';
import { AccountingService } from '@core/services/httpServices/accounting.service';
import { CategoryService } from '@core/services/httpServices/category.service';
import { ProductService } from '@core/services/httpServices/product.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  reactiveForm2: FormGroup;
  categories:category[];
  model:product = {};
  constructor(private fb: FormBuilder, private httpService: HttpService,private matsnackbar:MatSnackBar,private productService:ProductService,private categoryService:CategoryService,private accountingService:AccountingService) {
  }

  ngOnInit() {
    this.getcategories();
  }
  async save() {
    if (this.model.name!='') {
      this.matsnackbar.open('Saving record','Close',{duration:2000})
      var result =  await this.productService.productadd(this.model);
      console.log(result);
      if(result["status"]=="success")
      {
        this.matsnackbar.open('Successfully saved','Close',{duration:3000})
        this.model={};
      }
      else
      {
        this.matsnackbar.open('Failed to saved','Close',{duration:3000})
      }
      
    }else{
      this.matsnackbar.open('Enter name','Close',{duration:2000})
    }
  }
  getcategories()
  {
    this.categoryService.categoryget().then(res => {
      console.log('category in add');
      console.log(res);
      if(res["status"]=="success")
      {
        this.categories = res["data"]
      }
    });
  }
}
