import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Constants } from '../constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(Constants.apiRoot)) {
      const headers = req.headers.set('Authorization', `Bearer ${this.authService.getAccessToken()}`);
      const authReq = req.clone({ headers});
      return next.handle(authReq);

    } else {
      return next.handle(req);
    }

  }
}
