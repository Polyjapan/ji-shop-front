import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApiResult} from '../types/api_result';
import {BackendService} from './backend.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  private static ID_TOKEN_KEY = 'id_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private backend: BackendService, private jwtHelper: JwtHelperService, private route: Router) {

  }

  login(authToken: string, refreshToken: string, activeRedirect: boolean = true): string {
    localStorage.setItem(AuthService.ID_TOKEN_KEY, authToken);
    localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, refreshToken);
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

  private storeNextAction(action: string) {
    localStorage.setItem('_post_login_action', action);
  }

  private loadNextAction(): string {
    const act = localStorage.getItem('_post_login_action');
    localStorage.removeItem('_post_login_action');

    return act;
  }

  public logout(): void {
    const token = localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);

    if (token !== null) {
      this.backend.logout(token);
    }

    // Remove tokens and expiry time from localStorage
    localStorage.removeItem(AuthService.ID_TOKEN_KEY);
    localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);
  }

  public getTokenNow() {
    const token = localStorage.getItem(AuthService.ID_TOKEN_KEY);
    return this.jwtHelper.decodeToken(token);
  }

  public hasPermission(perm: string): boolean {
    const token = this.getTokenNow();
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
    if (token === null || localStorage.getItem(AuthService.REFRESH_TOKEN_KEY) === null) {
      return false;
    }

    if (this.jwtHelper.isTokenExpired(token, 60)) {
      // If the token expires in less than 1mn
      this.refreshToken();
    }

    return true;
  }

  public getToken(): Promise<string> {
    const token = localStorage.getItem(AuthService.ID_TOKEN_KEY);
    if (token === null || localStorage.getItem(AuthService.REFRESH_TOKEN_KEY) === null) {
      return Promise.reject('no token');
    }

    if (this.jwtHelper.isTokenExpired(token, 30)) {
      // If the token expires in less than 1mn
      return this.refreshToken();
    } else {
      return Promise.resolve(token);
    }
  }

  private refreshToken(): Promise<string> {
    const token = localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);

    if (token !== null) {
      this.backend.refreshAccessToken(token).toPromise().then(succ => {
        localStorage.setItem(AuthService.ID_TOKEN_KEY, succ.auth_token);
        return succ.auth_token;
      }).catch(rejected => {
        this.logout();
        return Promise.reject('invalid token');
      });
    } else {
      localStorage.removeItem(AuthService.ID_TOKEN_KEY);
      return Promise.reject('no token');
    }
  }
}

export class LoginResponse extends ApiResult {
  refresh_token?: string;
  auth_token?: string;
}
