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
export class CategoryService {
  public user: user = null;
  
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) {}
   
  categoryget()  {
    return new Promise((resolve,reject)=>{this.http.get <{
        status: string,
        data: any
      }>(environment.apiUrl + "category")
      .subscribe(res => {
        resolve(res);
      })
    })
  }
  categorygetonebyid(data) {
    return new Promise((resolve,reject)=>{this.http.post<{
        status: string,
        data: any
      }>(environment.apiUrl + "category/getonebyid",data)
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
  }
