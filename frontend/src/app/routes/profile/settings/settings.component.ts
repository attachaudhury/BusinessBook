import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpService } from '@core';
import {user} from "../../../shared/models/User"

@Component({
  selector: 'app-profile-settings',
  templateUrl: './settings.component.html',
})
export class ProfileSettingsComponent implements OnInit {
  model:user ={};
  constructor(private fb: FormBuilder,private httpService:HttpService) {
    
  }

  ngOnInit() {
    console.log(this.httpService.user)
  this.model = this.httpService.user;
  }
  async UpdateUser(){
    var user = {};
    user['password'] = this.model.password; 
    user['firstname'] = this.model.firstname; 
    user['lastname'] = this.model.lastname; 
    var result  = await this.httpService.updateprofile(user);
    console.log(result);
  }
}
