import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { HttpService } from '@core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,private authService:HttpService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  | Observable<boolean> | Promise<boolean>  {
      const isAuth = this.authService.getisloggedin();
    const user = this.authService.getuser();
      if (isAuth) {
            return true;
        }

        this.router.navigate(['/auth/login']);
        return false;
    }
}
