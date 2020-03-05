import { Component } from '@angular/core';
import { HttpService } from '@core';
import { user } from '@shared/models/user';
import { environment } from '@env/environment';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
})
export class ProfileLayoutComponent {
  model:user ={};
  environment;
  constructor(private httpService:HttpService)
  {
    this.model = this.httpService.user;
    this.environment = environment;
    console.log(environment)
  }
}
