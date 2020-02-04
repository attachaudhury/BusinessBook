import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { user } from '@shared/models/user';
import { product } from '@shared/models/product';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  departments:user[];
  model:user = {};
  constructor(private fb: FormBuilder, private httpService: HttpService,private matsnackbar:MatSnackBar) {
  }

  ngOnInit() {
    this.initpage();
  }
  async save() {
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
      var result =  await this.httpService.useradd(this.model);
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
  initpage()
  {
    this.httpService.usergetdepartments().then(res => {
      console.log('departments in initpage');
      console.log(res);
      if(res["status"]=="success")
      {
        this.departments = res["data"]
      }
    });
  }
}
