import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { category } from '@shared/models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  reactiveForm2: FormGroup;
  categories: category[];
  selectedid: string = '';
  selecteditem;
  constructor(private fb: FormBuilder, private httpService: HttpService, private activatedroute: ActivatedRoute) {

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
    console.log('category loaded result');
    console.log(requestresponse);
    if (requestresponse.status == "success") {
      this.selectedid = requestresponse.data;
    }
  }
  async save() {
    console.log('save item');
    return false;
    if (this.reactiveForm2.valid) {
      var result = await this.httpService.categoryedit(this.reactiveForm2.value);
      console.log(result);
      if (result["status"] == "success") {
        this.reactiveForm2.reset();

      }
    }
  }
}
