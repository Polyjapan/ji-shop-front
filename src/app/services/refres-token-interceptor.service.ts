// Taken from https://gist.github.com/abereghici/054cefbdcd8ccd3ff03dcc4e5155242b#file-token-interceptor-service-ts

import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs/Rx';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(public auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).catch(error => {
      // If error status is different than 401 we want to skip refresh token
      // So we check that and throw the error if it's the case
      if (error.status !== 401) {
        return Observable.throwError(error);
      }

      if (this.refreshTokenInProgress) {
        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        // – which means the new token is ready and we can retry the request again
        return this.refreshTokenSubject
          .filter(result => result !== null)
          .take(1)
          .switchMap(() => next.handle(this.addAuthenticationToken(request)));
      } else {
        this.refreshTokenInProgress = true;

        // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
        this.refreshTokenSubject.next(null);

        // Call auth.refreshAccessToken(this is an Observable that will be returned)
        return Observable.fromPromise(this.auth
          .getToken()
          .then((token: any) => {
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(token);

            return next.handle(this.addAuthenticationToken(request));
          })
          .catch((err: any) => {
            this.refreshTokenInProgress = false;

            this.auth.logout();
            return Observable.throwError(error);
          }));
      }
    });
  }

  addAuthenticationToken(request) {
    // Get access token from Local Storage
    const accessToken = this.auth.getTokenNow();

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.auth.getTokenNow()
      }
    });
  }
}
