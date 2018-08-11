import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthHttp} from 'angular2-jwt';
import {environment} from '../../environments/environment';
import {ItemsResponse} from '../types/items';
import {CheckedOutItem, FullOrder, Order, Source} from '../types/order';
import {LoginResponse} from './auth.service';
import {ApiResult} from '../types/api_result';


@Injectable()
/**
 * Provides mapping to the magic keeper forms
 */


/*

POST        /orders/create                  controllers.orders.CheckoutController.checkout

 */
export class BackendService {
  private _baseApiUrl = environment.apiurl;
  private _shopUrl = this._baseApiUrl + '/shop';
  private _ordersUrl = this._baseApiUrl + '/orders';
  private _authUrl = this._baseApiUrl + '/users';

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  getItems(): Promise<ItemsResponse> {
    return this.http.get(this._shopUrl + '/items')
      .toPromise()
      .then(result => result.json() as ItemsResponse);
  }

  getAllItems(): Promise<ItemsResponse> {
    // TODO: handle errors
    return this.http.get(this._shopUrl + '/items/all')
      .toPromise()
      .then(result => result.json() as ItemsResponse);
  }

  getPdf(barcode: string): Promise<Response> {
    return this.authHttp.get(this._ordersUrl + '/download/' + barcode + '.pdf').toPromise();
  }

  getOrders(): Promise<Order[]> {
    return this.authHttp.get(this._ordersUrl + '/view')
      .toPromise()
      .then(r => r.json() as Order[]);
  }

  getOrder(id: number): Promise<FullOrder> {
    return this.authHttp.get(this._ordersUrl + '/view/' + id)
      .toPromise()
      .then(r => r.json() as FullOrder);
  }

  login(user: string, password: string): Promise<LoginResponse> {
    return this.http
      .post(this._authUrl + '/login', {'email': user, 'password': password})
      .toPromise()
      .then(result => {
        const resp = result.json() as LoginResponse;
        resp.token = result.headers.get('Authorization');
        return resp;
      });
  }

  register(user: string, password: string, lastname: string, firstname: string): Promise<ApiResult> {
    return this.http
      .post(this._authUrl + '/signup', {'email': user, 'password': password, 'firstname': firstname, 'lastname': lastname})
      .toPromise()
      .then(r => r.json() as ApiResult);
  }

  emailConfirm(user: string, code: string): Promise<ApiResult> {
    return this.http
      .post(this._authUrl + '/emailConfirm', {'email': user, 'code': code})
      .toPromise()
      .then(r => r.json() as ApiResult);
  }

  passwordRecover(user: string): Promise<ApiResult> {
    return this.http
      .post(this._authUrl + '/recoverPassword', {'email': user})
      .toPromise()
      .then(r => r.json() as ApiResult);
  }

  passwordChange(password: string): Promise<ApiResult> {
    return this.http
      .post(this._authUrl + '/changePassword', {'password': password})
      .toPromise()
      .then(r => r.json() as ApiResult);
  }

  passwordReset(user: string, code: string, password: string): Promise<ApiResult> {
    return this.http
      .post(this._authUrl + '/resetPassword', {'email': user, 'code': code, 'password': password})
      .toPromise()
      .then(r => r.json() as ApiResult);
  }

  placeOrder(items: CheckedOutItem[], source?: Source): Promise<CheckOutResponse> {
    return this.authHttp
      .post(this._ordersUrl + '/create', {'items': items, 'orderType': source})
      .toPromise()
      .then(r => r.json() as CheckOutResponse);
  }
}

export class CheckOutResponse extends ApiResult {
  ordered?: CheckedOutItem[];
  redirect?: string;
}


