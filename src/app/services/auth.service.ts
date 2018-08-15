import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApiResult} from '../types/api_result';
import {BackendService} from './backend.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private backend: BackendService, private jwtHelper: JwtHelperService, private route: Router) {}

  login(token: string, activeRedirect: boolean = true): string {
    localStorage.setItem('id_token', token);
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
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('id_token');
  }

  public getToken() {
    const token = localStorage.getItem('id_token');
    return this.jwtHelper.decodeToken(token);
  }

  public hasPermission(perm: String): boolean {
    const token = this.getToken();
    if (token) {
      const perms = token['perms'] as Set<String>;

      if (perms.has(perm)) {
        return true;
      } else {
        const groups = perm.split('.').reverse();
        let currentGroup = '';

        while (groups.length > 0) {
          if (perms.has(currentGroup + '*')) {
            return true;
          }

          currentGroup = currentGroup + groups.pop() + '.';
        }

        return false;
      }
    }
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('id_token');
    if (token === null) {
      return false;
    }

    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      return false;
    }
  }
}

export class LoginResponse extends ApiResult {
  token?: string;
}
