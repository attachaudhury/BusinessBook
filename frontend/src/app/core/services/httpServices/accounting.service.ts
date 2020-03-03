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
export class AccountingService {
  public user: user = null;
  
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) {}
    //#region accounting
    accountingpossalenew(data){
      return new Promise((resolve,reject)=>{
        this.http.post<{status?:string,data?:any}>(environment.apiUrl + "accounting/possalenew",data).subscribe(res=>{
          resolve(res)
        })
      })
    }
    accountingpossaleget(){
      return new Promise((resolve,reject)=>{
        this.http.get<{status?:string,data?:any}>(environment.apiUrl + "accounting/possaleget").subscribe(res=>{
          resolve(res)
        })
      })
    }
    accountingpurchasenew(data){
      return new Promise((resolve,reject)=>{
        this.http.post<{status?:string,data?:any}>(environment.apiUrl + "accounting/purchasenew",data).subscribe(res=>{
          resolve(res)
        })
      })
    }
    accountingpurchaseget(){
      return new Promise((resolve,reject)=>{
        this.http.get<{status?:string,data?:any}>(environment.apiUrl + "accounting/purchaseget").subscribe(res=>{
          resolve(res)
        })
      })
    }
    accountingdashboarddataget(){
      return new Promise((resolve,reject)=>{
        this.http.get<{status?:string,data?:any}>(environment.apiUrl + "accounting/dashboarddataget").subscribe(res=>{
          resolve(res)
        })
      })
    }
    //#endregion accounting
  }
