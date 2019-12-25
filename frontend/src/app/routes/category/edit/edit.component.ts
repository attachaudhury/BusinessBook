import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { category } from '@shared/models/category';

@Component({
  selector: 'app-category-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  reactiveForm2: FormGroup;
  categories:category[];
  constructor(private fb: FormBuilder, private httpService: HttpService) {

    this.reactiveForm2 = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }
  async save() {
    if (this.reactiveForm2.valid) {
      var result =  await this.httpService.categoryedit(this.reactiveForm2.value);
      console.log(result);
      if(result["status"]=="success")
      {
        this.reactiveForm2.reset();
        
      }
    }
  }
}
