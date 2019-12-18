import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '@core';

@Component({
  selector: 'app-category-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  reactiveForm2: FormGroup;

  constructor(private fb: FormBuilder,private httpService: HttpService) {
  
    this.reactiveForm2 = this.fb.group({
      name: ['', [Validators.required]],
      parent: [''],
    });
  }

  ngOnInit() {
    
  }

  getErrorMessage(form: FormGroup) {
    return form.get('email').hasError('required')
      ? 'You must enter a value'
      : form.get('email').hasError('email')
      ? 'Not a valid email'
      : '';
  }
  save()
  {
    if(this.reactiveForm2.valid)
    {
      this.httpService.categoryadd(this.reactiveForm2.value);
    }
  }
}
