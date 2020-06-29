import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { category } from '@shared/models/category';
import { product } from '@shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { user } from '@shared/models/user';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customeredit.component.html',
})
export class CustomerEditComponent implements OnInit {
  departments:user[];
  model:user = {};
  modelid: string = '';
  constructor(private fb: FormBuilder, private httpService: HttpService, private activatedroute: ActivatedRoute,private matsnackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(params => {
      this.modelid = params.get('_id');
      this.initpage();
    })
  }
  async initpage()
  {
    this.httpService.usergetdepartments().then(res => {
      console.log('departments in initpage');
      console.log(res);
      if(res["status"]=="success")
      {
        this.departments = res["data"]
      }
    });
    var requestresponse = await this.httpService.usergetonebyid({ _id: this.modelid });
    console.log(requestresponse);
    if (requestresponse["status"] == "success") {
      this.model = requestresponse["data"]; 
    }
  }
  async save() {
    if(this.model.department==null)
    {
      this.model.department=undefined;
    }
    console.log(this.model);
    if(this.model.role=='admin' && this.model.username=='admin'){
      this.matsnackbar.open('Admin can not be updated','Close',{duration:3000});
      return false;
    }
    if(this.model.role=='user' && this.model.department==undefined){
      this.matsnackbar.open('Please select department for user role','Close',{duration:3000});
      return false;
    }
    if(this.model.role=='department' && this.model.department!==undefined){
      this.matsnackbar.open('Department can not be selected for department role','Close',{duration:3000});
      return false;
    }
    console.log(this.model.username)
    if (this.model.username!=undefined && this.model.password!=undefined&& this.model.role!=undefined) {
      this.matsnackbar.open('Saving record','Close',{duration:2000})
      console.log(this.model)
      var result =  await this.httpService.userupdate(this.model);
      console.log(result);
      if(result["status"]=="success")
      {
        this.matsnackbar.open('Successfully saved','Close',{duration:3000})
        this.model={};
        this.initpage();
      }
      else
      {
        this.matsnackbar.open('Failed to saved','Close',{duration:3000})
      }
      
    }else{
      this.matsnackbar.open('Please Fill form','Close',{duration:2000})
    }
  }
}
