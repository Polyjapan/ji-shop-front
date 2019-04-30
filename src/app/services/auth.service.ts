import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApiResult} from '../types/api_result';
import {BackendService} from './backend.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  private static ID_TOKEN_KEY = 'id_token';
  private static TEMP_TOKEN_KEY = '_login_temp_token';
  private static REDIRECT_LOCATION_KEY = 'post_login_action';

  constructor(private backend: BackendService, private jwtHelper: JwtHelperService, private route: Router) {
  }

  get temporaryToken(): string {
    return localStorage.getItem(AuthService.TEMP_TOKEN_KEY);
  }

  login(result: LoginResponse, activeRedirect: boolean = true): string {
    if (result.requireInfo) {
      this.requestMoreInfo(result.token);
      return 'firstLogin';
    }


    localStorage.setItem(AuthService.ID_TOKEN_KEY, result.token);
    this.removeTemporaryToken();

    let act = this.loadNextAction();

    if (!act) {
      act = '/';
    }

    if (activeRedirect) {
      this.route.navigate([act]);
    }
    return act;
  }

  requestMoreInfo(token: string) {
    if (this.isAuthenticated()) {
      return;
    }

    this.storeTemporaryToken(token);
    this.route.navigate(['firstLogin']);
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

  private storeTemporaryToken(token: string) {
    localStorage.setItem(AuthService.TEMP_TOKEN_KEY, token);
  }

  private removeTemporaryToken() {
    localStorage.removeItem(AuthService.TEMP_TOKEN_KEY);
  }

  private storeNextAction(action: string) {
    localStorage.setItem(AuthService.REDIRECT_LOCATION_KEY, action);
  }

  private loadNextAction(): string {
    const act = localStorage.getItem(AuthService.REDIRECT_LOCATION_KEY);
    localStorage.removeItem(AuthService.REDIRECT_LOCATION_KEY);

    return act;
  }
}

export class LoginResponse extends ApiResult {
  token?: string;
  requireInfo: boolean;
}
