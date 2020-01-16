import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { category } from '@shared/models/category';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-category-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  reactiveForm2: FormGroup;
  categories: category[];
  selectedid: string = '';
  selecteditem;
  constructor(private fb: FormBuilder, private httpService: HttpService, private activatedroute: ActivatedRoute,private matsnackbar: MatSnackBar) {

    this.reactiveForm2 = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(params => {
      this.selectedid = params.get('_id');
      this.loadpagedata();
    })
  }
  async loadpagedata() {
    var requestresponse = await this.httpService.categorygetonebyid({ _id: this.selectedid });
    if (requestresponse["status"] == "success") {
      
      this.selecteditem = requestresponse["data"];
      this.reactiveForm2.setValue({name:this.selecteditem['name']})
    console.log(this.selecteditem)
    }
  }
  async save() {
    if (this.reactiveForm2.valid) {
      var result = await this.httpService.categoryedit({_id:this.selecteditem['_id'],...this.reactiveForm2.value});
      console.log(result);
      if (result["status"] == "success") {
        //this.reactiveForm2.reset();
        this.matsnackbar.open('Updated','Close',{duration:3000})
      }
      else{
        this.matsnackbar.open('Update Failed','Close',{duration:3000})
      }
    }
  }
}
