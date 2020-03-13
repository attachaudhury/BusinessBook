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
  }
  dummyProfileImageChangedClicked(){
    var imageinput =document.getElementById("profileImageInput") as HTMLElement;
    imageinput.click();
  }
  async profileImageChanged(event)
  {
    if(event.target.files.length>0){
      const uploadData = new FormData();
      uploadData.append('files', event.target.files[0]);
      var result =await this.httpService.updateprofileimage(uploadData);
      console.log('api result');
      console.log(result);
      if (result['status'] == "success") {
        this.model = result['data'];
      }
    }
    
  }
}
