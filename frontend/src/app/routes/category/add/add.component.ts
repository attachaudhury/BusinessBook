import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';
import { category } from '@shared/models/category';

@Component({
  selector: 'app-category-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  reactiveForm2: FormGroup;
  categories:category[];
  constructor(private fb: FormBuilder, private httpService: HttpService) {

    this.reactiveForm2 = this.fb.group({
      name: ['', [Validators.required]],
      parentId: [''],
    });
  }

  ngOnInit() {
    this.httpService.categorygetarraytree().then(res => {
      console.log('categorygettree in add');
      console.log(res);
      if(res.status=="success")
      {
        this.categories = res.data
      }
    });
  }
  async save() {
    if (this.reactiveForm2.valid) {
      var result =  await this.httpService.categoryadd(this.reactiveForm2.value);
      console.log(result);
    }
  }
}
