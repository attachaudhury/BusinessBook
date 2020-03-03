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
export class ProductService {
  public user: user = null;
  
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) {}
  productget()  {
    return new Promise((resolve,reject)=>{this.http.get <{
        status: string,
        data: any
      }>(environment.apiUrl + "product")
      .subscribe(res => {
        resolve(res);
      })
    })
  }
  productgetonebyid(data) {
    return new Promise((resolve,reject)=>{this.http.post<{
        status: string,
        data: any
      }>(environment.apiUrl + "product/getonebyid",data)
      .subscribe(res => {
        resolve(res);
      })
    })
  }
  productadd(data) {
    return new Promise((resolve,reject)=>{
      this.http.post <{
        status: string,
        data: any
      } > (environment.apiUrl + "product/add", data)
      .subscribe(res => {
        resolve(res);
      });
    });
  }
  productdelete(data) {
    return new Promise((resolve,reject)=>{
      this.http.post <{
        status: string,
        data: any
      } > (environment.apiUrl + "product/delete", data)
      .subscribe(res => {
        resolve(res);
      })
    });
  }
  productedit(data) {
    return new Promise((resolve,reject)=>{
      this.http.post <{
        status: string,
        data: any
      } > (environment.apiUrl + "product/edit", data)
      .subscribe(res => {
        resolve(res);
      });
    });
  }
}
