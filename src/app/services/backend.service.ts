import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
import {ItemsResponse} from '../types/items';
import {CheckedOutItem, FullOrder, Order, Source} from '../types/order';
import {LoginResponse} from './auth.service';
import {ApiResult} from '../types/api_result';
import {HttpClient} from '@angular/common/http';
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

  getItems(): Promise<ItemsResponse> {
    return this.http.get<ItemsResponse>(this._shopUrl + '/items')
      .toPromise();
  }

  getAllItems(): Promise<ItemsResponse> {
    // TODO: handle errors
    return this.http.get<ItemsResponse>(this._shopUrl + '/items/all')
      .toPromise();
  }

  getPdf(barcode: string): Observable<Blob> {
    return this.http.get(this._ordersUrl + '/download/' + barcode + '.pdf', {responseType: 'blob'});
  }

  getOrders(): Promise<Order[]> {
    return this.http.get<Order[]>(this._ordersUrl + '/view')
      .toPromise();
  }

  getOrder(id: number): Promise<FullOrder> {
    return this.http.get<FullOrder>(this._ordersUrl + '/view/' + id)
      .toPromise();
  }

  login(user: string, password: string): Promise<LoginResponse> {
    return this.http
      .post<LoginResponse>(this._authUrl + '/login', {'email': user, 'password': password}, { observe: 'response' })
      .toPromise()
      .then(result => {
        const resp = result.body;
        resp.token = result.headers.get('Authorization');
        return resp;
      });
  }

  register(user: string, password: string, lastname: string, firstname: string): Promise<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/signup', {'email': user, 'password': password, 'firstname': firstname, 'lastname': lastname})
      .toPromise();
  }

  emailConfirm(user: string, code: string): Promise<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/emailConfirm', {'email': user, 'code': code})
      .toPromise();
  }

  passwordRecover(user: string): Promise<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/recoverPassword', {'email': user})
      .toPromise();
  }

  passwordChange(password: string): Promise<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/changePassword', {'password': password})
      .toPromise();
  }

  passwordReset(user: string, code: string, password: string): Promise<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/resetPassword', {'email': user, 'code': code, 'password': password})
      .toPromise();
  }

  placeOrder(items: CheckedOutItem[], source?: Source): Promise<CheckOutResponse> {
    return this.http
      .post<CheckOutResponse>(this._ordersUrl + '/create', {'items': items, 'orderType': source})
      .toPromise();
  }
}

export class CheckOutResponse extends ApiResult {
  ordered?: CheckedOutItem[];
  redirect?: string;
}


