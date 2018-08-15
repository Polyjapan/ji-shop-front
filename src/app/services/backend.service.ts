import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {ItemsResponse} from '../types/items';
import {CheckedOutItem, FullOrder, Order, Source} from '../types/order';
import {LoginResponse} from './auth.service';
import {ApiResult} from '../types/api_result';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
/**
 * Provides mapping to the magic keeper forms
 */


/*

POST        /orders/create                  controllers.orders.CheckoutController.checkout

 */

// https://angular.io/guide/http#error-handling
// Todo: switch everything to Observables
export class BackendService {
  private _baseApiUrl = environment.apiurl;
  private _shopUrl = this._baseApiUrl + '/shop';
  private _ordersUrl = this._baseApiUrl + '/orders';
  private _authUrl = this._baseApiUrl + '/users';

  constructor(private http: HttpClient) {
  }

  getItems(): Observable<ItemsResponse> {
    return this.http.get<ItemsResponse>(this._shopUrl + '/items');
  }

  getAllItems(): Observable<ItemsResponse> {
    // TODO: handle errors
    return this.http.get<ItemsResponse>(this._shopUrl + '/items/all');
  }

  getPdf(barcode: string): Observable<Blob> {
    return this.http.get(this._ordersUrl + '/download/' + barcode + '.pdf', {responseType: 'blob'});
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this._ordersUrl + '/view');
  }

  getOrder(id: number): Observable<FullOrder> {
    return this.http.get<FullOrder>(this._ordersUrl + '/view/' + id);
  }

  login(data: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this._authUrl + '/login', data);
  }

  register(data: string): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/signup', data);
  }

  emailConfirm(user: string, code: string): Observable<LoginResponse> {
    return this.http
      .post<ApiResult>(this._authUrl + '/emailConfirm', {'email': user, 'code': code});
  }

  passwordRecover(user: string): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/recoverPassword', {'email': user});
  }

  passwordChange(password: string): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/changePassword', {'password': password});
  }

  passwordReset(user: string, code: string, password: string): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/resetPassword', {'email': user, 'code': code, 'password': password});
  }

  placeOrder(items: CheckedOutItem[], source?: Source): Observable<CheckOutResponse> {
    return this.http
      .post<CheckOutResponse>(this._ordersUrl + '/create', {'items': items, 'orderType': source});
  }
}

export class CheckOutResponse extends ApiResult {
  ordered?: CheckedOutItem[];
  redirect?: string;
}


