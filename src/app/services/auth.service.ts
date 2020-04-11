
import {of as observableOf, AsyncSubject, Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

import {ApiResult} from '../types/api_result';
import {BackendService} from './backend.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {

  public static ID_TOKEN_KEY = 'id_token';
  private static REDIRECT_LOCATION_KEY = 'post_login_action';

  constructor(private backend: BackendService, private jwtHelper: JwtHelperService, private route: Router) {
  }


  login(result: LoginResponse, activeRedirect: boolean = true): string {
    localStorage.setItem(AuthService.ID_TOKEN_KEY, result.token);

    let act = this.loadNextAction();

    if (!act) {
      act = '/';
    }

    if (activeRedirect) {
      this.route.navigate([act]);
    }
    return act;
  }

  requiresLogin(redirectTo: string): boolean {
    if (this.isAuthenticated()) {
      return true;
    } else {
      this.storeNextAction(redirectTo);
      this.route.navigate(['login']);

      return false;
    }
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem(AuthService.ID_TOKEN_KEY);
  }

  public getToken() {
    const token = localStorage.getItem(AuthService.ID_TOKEN_KEY);
    return this.jwtHelper.decodeToken(token);
  }

  public hasPermission(perm: string): boolean {
    const token = this.getToken();
    if (this.isAuthenticated() && token && token.user && token.user.permissions) {
      const perms: string[] = token.user.permissions;

      if (perms && perms.indexOf('-' + perm) !== -1) {
        return false; // perms exclusion
      } else if (perms && perms.indexOf(perm) !== -1) {
        return true;
      } else {
        const groups = perm.split('.').reverse();
        let currentGroup = '';

        while (groups.length > 0) {
          if (perms && perms.indexOf(currentGroup + '*') !== -1) {
            return true;
          }

          currentGroup = currentGroup + groups.pop() + '.';
        }

        return false;
      }
    } else {
      return false;
    }
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(AuthService.ID_TOKEN_KEY);
    if (token === null) {
      return false;
    }

    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      return false;
    }
  }

  private storeNextAction(action: string) {
    localStorage.setItem(AuthService.REDIRECT_LOCATION_KEY, action);
  }

  private loadNextAction(): string {
    const act = localStorage.getItem(AuthService.REDIRECT_LOCATION_KEY);
    localStorage.removeItem(AuthService.REDIRECT_LOCATION_KEY);

    return act;
  }

  loginUrl() {
    const route = window.location.origin + this.route.createUrlTree(['/', 'login']).toString();
    return environment.auth.apiurl + '/cas/login?service=' + route;
  }
}

export class LoginResponse extends ApiResult {
  token?: string;
}
