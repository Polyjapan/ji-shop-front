import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApiResult} from '../types/api_result';
import {BackendService} from './backend.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AuthService {

  constructor(private backend: BackendService, private jwtHelper: JwtHelperService) {}

  login(user: string, password: string): Observable<LoginResponse> {


    return this.backend
      .login(user, password)
      .lift<LoginResponse>((resp: LoginResponse) => {
        if (resp.token != null) {
          resp.token = resp.token.replace('Bearer ', ''); // remove the prefix in the token
        }

        if (resp.success) {
          localStorage.setItem('id_token', resp.token);
        }

        return resp;
      });
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
