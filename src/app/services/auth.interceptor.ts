import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';
import {parse} from 'url';
import {environment} from '../../environments/environment';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  isWhitelistedDomain(request: HttpRequest<any>): boolean {
    const requestUrl: any = parse(request.url, false, true);
    const requestHost: string = requestUrl.host || (typeof location === 'object' && location.host);
    return (requestHost === undefined || environment.tokenWhitelist.indexOf(requestHost) > -1);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.doIntercept(req, next);
  }

  private doIntercept(req: HttpRequest<any>, next: HttpHandler, retry: boolean = false): Observable<HttpEvent<any>> {
    const isRefresh = req.url.endsWith('/users/refresh');
    const srcReq = req;

    if (this.auth.isAuthenticated() && this.isWhitelistedDomain(req) && !isRefresh) {
      if (this.auth.needsRefresh()) {
        console.log('Refreshing token...');
        return this.auth.refreshToken().flatMap(res => {
          if (res === true) {
            console.log('Done, requesting again');
            return this.doIntercept(req, next, true);
          } else {
            return next.handle(srcReq); // Pass the source request
          }
        });
      } else {
        req = req.clone({
          setHeaders: {
            'Authorization': 'Bearer ' + this.auth.getRawToken()
          }
        });
      }
    } else if (this.auth.isAuthenticated() && isRefresh) {
      req = req.clone({
        setHeaders: {
          'Authorization': 'Refresh ' + this.auth.getRawRefreshToken()
        }
      });
    }

    return next.handle(req).catch(err => {
      console.log(err);
      if (err.status === 401 && !isRefresh) {
        if (retry) {
          throw err;
        }
        console.log('Refreshing token...');

        return this.auth.refreshToken().flatMap(res => {
          if (res) {
            return this.doIntercept(req, next, true);
          } else {
            return next.handle(srcReq); // Pass the source request
          }
        });
      } else {
        throw err;
      }
    });
  }
}
