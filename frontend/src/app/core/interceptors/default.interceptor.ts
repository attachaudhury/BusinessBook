import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { HttpService } from '@core';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private authService: HttpService) { }
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(req).pipe(
  //     mergeMap((event: any) => {
  //       return of(event);
  //     }),
  //     catchError((err: HttpErrorResponse) => {
  //       return of(err);
  //     })
  //   );
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isloggedin = this.authService.getisloggedin();
    if (isloggedin) {
      const user = this.authService.getuser();
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', "Bearer " + user._id)
      })
      return next.handle(authRequest)
    }
    else {
      const authRequest = req.clone()
      return next.handle(authRequest)
    }
  }
}
