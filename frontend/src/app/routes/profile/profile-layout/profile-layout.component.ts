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
  async updateProfileImage(event)
  {
    if(event.files>0){
      const uploadData = new FormData();
      uploadData.append('files', event.files[0]);
      var result = this.httpService.updateprofileimage(uploadData);
      if (result['status'] == "success") {
        this.model = result['data'];
      }
    }
    
  }
}
