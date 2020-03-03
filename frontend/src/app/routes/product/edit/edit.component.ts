import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { category } from '@shared/models/category';
import { product } from '@shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ProductService } from '@core/services/httpServices/product.service';
import { CategoryService } from '@core/services/httpServices/category.service';
import { AccountingService } from '@core/services/httpServices/accounting.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  reactiveForm2: FormGroup;
  categories: category[];
  modelid: string = '';
  model:product;
  constructor(private fb: FormBuilder, private httpService: HttpService,private productService:ProductService,private categoryService:CategoryService,private accountingService:AccountingService, private activatedroute: ActivatedRoute,private matsnackbar: MatSnackBar) {

  }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(params => {
      this.modelid = params.get('_id');
      this.loadpagedata();
    })
  }
  async loadpagedata() {
   var catresult = await this.categoryService.categoryget();
   console.log('category in add');
      console.log(catresult);
      if(catresult["status"]=="success")
      {
        this.categories = catresult["data"]
      }
  
    var requestresponse = await this.productService.productgetonebyid({ _id: this.modelid });
    console.log(requestresponse);
    if (requestresponse["status"] == "success") {
      
      this.model = requestresponse["data"]; 
    }

  }
  async save() {
    if (this.model.name) {
      var result = await this.productService.productedit(this.model);
      console.log(result);
      if (result["status"] == "success") {
        this.matsnackbar.open('Updated','Close',{duration:3000})
      }
      else{
        this.matsnackbar.open('Update Failed','Close',{duration:3000})
      }
    }
  }
}
