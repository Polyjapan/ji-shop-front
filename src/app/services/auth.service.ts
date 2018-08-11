import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {JwtHelper} from 'angular2-jwt';
import {ApiResult} from '../types/api_result';
import {BackendService} from './backend.service';

@Injectable()
export class AuthService {
  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private backend: BackendService) {}

  login(user: string, password: string): Promise<LoginResponse> {


    return this.backend
      .login(user, password)
      .then(resp => {
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
