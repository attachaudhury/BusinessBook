import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '@core/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  reactiveForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private httpService: HttpService) {
    this.reactiveForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    
  }

  login() {
    console.log(this.reactiveForm.value);
    var username = this.reactiveForm.value.username;
    var password = this.reactiveForm.value.password;
    this.httpService.signin(username,password);
    return false;
    this.router.navigateByUrl('/');
  }
}
