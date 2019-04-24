import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {Item, ItemList, ItemsResponse} from '../types/items';
import {CheckedOutItem, FullOrder, FullOrderData, ImportedItemData, Order, OrderLog, Source} from '../types/order';
import {LoginResponse} from './auth.service';
import {ApiResult} from '../types/api_result';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ScanResult} from '../types/scan_result';
import {ScanConfiguration, ScanConfigurationWithItems} from '../types/scan_configuration';
import {Event} from '../types/event';
import {PosConfiguration, PosGetConfigResponse, PosOrderResponse, PosPaymentLog} from '../types/pos_configuration';
import {StatsReturn} from '../types/stats';
import {Client, ClientAndPermissions} from '../types/client';
import {TicketData} from '../types/ticket_data';
import {ObservableInput} from 'rxjs/Observable';


@Injectable()
export class AuthApiService {
  private baseApiUrl = environment.auth.apiurl + '/hidden/';
  private apiKey = environment.auth.clientId;
  private loginUrl = this.baseApiUrl + 'login';
  private registerUrl = this.baseApiUrl + 'register';

  static parseGeneralError(code: number): string {
    switch (code) {
      case GeneralErrorCodes.MissingData:
        return 'Une erreur s\'est produite lors de l\'envoi des données au serveur.';
      case GeneralErrorCodes.InvalidCaptcha:
        return 'Le captcha est incorrect.';
      case GeneralErrorCodes.UnknownApp:
      case GeneralErrorCodes.InvalidAppSecret:
        return 'L\'application est mal configurée. Merci de revenir plus tard.';
      default:
        return 'Une erreur inconnue s\'est produite : ' + code;
    }
  }

  constructor(private http: HttpClient) {
  }

  login(data: string): Observable<AuthApiSuccess> {
    data['clientId'] = this.apiKey;
    return this.http
      .post<AuthApiSuccess>(this.loginUrl, data);
  }

  /* register(data: string): Observable<AuthApiSuccess> {
     return this.http
       .post<ApiResult>(this._authUrl + '/signup', data);
   }

   emailConfirm(user: string, code: string): Observable<LoginResponse> {
     return this.http
       .post<ApiResult>(this._authUrl + '/emailConfirm', {'email': user, 'code': code});
   }

   passwordRecover(mail: string, captcha: string): Observable<ApiResult> {
     return this.http
       .post<ApiResult>(this._authUrl + '/recoverPassword', {'email': mail, 'captcha': captcha});
   }

   passwordChange(password: string): Observable<ApiResult> {
     return this.http
       .post<ApiResult>(this._authUrl + '/changePassword', {'password': password});
   }

   passwordReset(user: string, code: string, password: string): Observable<ApiResult> {
     return this.http
       .post<ApiResult>(this._authUrl + '/resetPassword', {'email': user, 'code': code, 'password': password});
   }*/


}

export enum GeneralErrorCodes {
  UnknownError = 100,
  MissingData = 101,
  UnknownApp = 102,
  InvalidAppSecret = 103,
  InvalidCaptcha = 104
}

export enum LoginErrorCodes {
  UserOrPasswordInvalid = 201,
  EmailNotConfirmed = 202
}

export class AuthApiSuccess {
  ticket: String;
}

export class AuthApiError {
  code: number;
}
