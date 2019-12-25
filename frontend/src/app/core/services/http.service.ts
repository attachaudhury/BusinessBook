import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import { user } from '@shared/models/user';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private isloggedin = false;
  public user: user = null;
  private authlistener = new Subject < boolean > ();
  private userlistener = new Subject < any > ();
  
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) {}

    // #region login logout profile users
    signin(username: string, password: string) {
      const user: user = {
        username: username,
        password: password
      }
      this.http.post < {
          status: string,
          data: any
        } > (environment.apiUrl + "user/signin", user)
        .subscribe(res => {
          console.log("api login retured object");
          console.log(res);
          if (res.status == "success") {
            this.user = res.data;
            this.isloggedin = true;
            this.authlistener.next(true)
            this.userlistener.next(res.data)
            localStorage.setItem("isloggedin", JSON.stringify(true));
            localStorage.setItem("user", JSON.stringify(this.user));
            this.router.navigate(['/dashboard'])
          }
        })
    }
    getisloggedin() {
      return this.isloggedin;
    }
    getuser() {
      return this.user
    }
    getauthlistener() {
      return this.authlistener.asObservable();
    }
    getuserlistener() {
      return this.userlistener.asObservable();
    }
    logout() {
      this.user = null;
      this.isloggedin = false;
      this.authlistener.next(false)
      this.userlistener.next(null)
      localStorage.removeItem("isloggedin");
      localStorage.removeItem("user")
      this.router.navigate(['/auth/login'])
    }
    autoAuthUser() {
      const isloggedin = localStorage.getItem("isloggedin");
      if (isloggedin) {
        this.isloggedin = true
        const currentUser = JSON.parse(localStorage.getItem("user"));
        this.user = currentUser;
        this.authlistener.next(true)
        this.userlistener.next(currentUser)
        //this.router.navigate(['/dashboard'])
        //console.log('user loggin with auto auth')
        //console.log(this.user);
      }
    }
    updateprofile(newdataobject) {
      console.log('updateprofile')
      var data = newdataobject
      this.http.post < {
          status: string,
          data: any
        } > (environment.apiUrl + "user/updateprofile", data)
        .subscribe(res => {
          console.log(res);
          if (res.status == "success") {
            this._snackBar.open("Information updated", 'Close', {
              duration: 3000,
            });
            this.user = res.data;
            localStorage.setItem("user", JSON.stringify(this.user));
            this.userlistener.next(this.user);
          }
        })
    }
    updateprofileimage(profileimage) {
      const uploadData = new FormData();
      uploadData.append('files', profileimage);
      this.http.post < {
          status: string,
          data: any
        } > (environment.apiUrl + "user/updateprofileimage", uploadData)
        .subscribe(res => {
          console.log(res);
          if (res.status == "success") {
            this.user.profileimage = res.data.profileimage;
            localStorage.setItem("user", JSON.stringify(this.user));
            this.userlistener.next(this.user);
          }
        })
    }
    updatecompanyimage(companyimage) {
      const uploadData = new FormData();
      uploadData.append('files', companyimage);
      this.http.post < {
          status: string,
          data: any
        } > (environment.apiUrl + "user/updatecompanyimage", uploadData)
        .subscribe(res => {
          console.log(res);
          if (res.status == "success") {
            this.user.companyimage = res.data.companyimage;
            localStorage.setItem("user", JSON.stringify(this.user));
            this.userlistener.next(this.user);
          }
        })
    }
    updatebrandimage(companyimage) {
      const uploadData = new FormData();
      uploadData.append('files', companyimage);
      this.http.post < {
          status: string,
          data: any
        } > (environment.apiUrl + "user/updatebrandimage", uploadData)
        .subscribe(res => {
          console.log(res);
          if (res.status == "success") {
            this.user.brandimage = res.data.brandimage;
            localStorage.setItem("user", JSON.stringify(this.user));
            this.userlistener.next(this.user);
          }
        })
    }
    adduser(newdataobject) {
      var data = newdataobject
      this.http.post < {
          status: string,
          data: any
        } > (environment.apiUrl + "user/add", data)
        .subscribe(res => {
          console.log(res)
          if (res.status == "success") {
            this._snackBar.open("New User Added", 'Close', {
              duration: 6000,
            });
            
          }
        })
    }
    // #endregion login logout profile users
  

    // #region category
    categoryget(): Promise<any>  {
      return new Promise((resolve,reject)=>{this.http.get <{
          status: string,
          data: any
        }>(environment.apiUrl + "category")
        .subscribe(res => {
          resolve(res);
        })
      })
    }
    categoryadd(data) {
      return new Promise((resolve,reject)=>{
        this.http.post <{
          status: string,
          data: any
        } > (environment.apiUrl + "category/add", data)
        .subscribe(res => {
          resolve(res);
        });
      });
    }
    categorydelete(data) {
      return new Promise((resolve,reject)=>{
        this.http.post <{
          status: string,
          data: any
        } > (environment.apiUrl + "category/delete", data)
        .subscribe(res => {
          resolve(res);
        })
      });
    }
    categoryedit(data) {
      return new Promise((resolve,reject)=>{
        this.http.post <{
          status: string,
          data: any
        } > (environment.apiUrl + "category/edit", data)
        .subscribe(res => {
          resolve(res);
        });
      });
    }
    // #endregion category
}
