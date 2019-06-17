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
import {ScanConfiguration, ScanConfigurationList, ScanConfigurationWithItems} from '../types/scan_configuration';
import {Event} from '../types/event';
import {PosConfiguration, PosConfigurationList, PosGetConfigResponse, PosOrderResponse, PosPaymentLog} from '../types/pos_configuration';
import {StatsReturn} from '../types/stats';
import {Client, ClientAndPermissions} from '../types/client';
import {TicketData} from '../types/ticket_data';


@Injectable()
export class BackendService {
  private _baseApiUrl = environment.apiurl;
  private _shopUrl = this._baseApiUrl + '/shop';
  private _ordersUrl = this._baseApiUrl + '/orders';
  private _authUrl = this._baseApiUrl + '/users';
  private _adminUrl = this._baseApiUrl + '/admin';
  private _scanUrl = this._baseApiUrl + '/scan';
  private _posUrl = this._baseApiUrl + '/pos';

  constructor(private http: HttpClient) {
  }

  getEditions(): Observable<Event[]> {
    return this.http.get<Event[]>(this._adminUrl + '/events');
  }

  getProducts(event: number): Observable<Item[]> {
    return this.http.get<Item[]>(this._adminUrl + '/events/' + event + '/products');
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(this._adminUrl + '/events/' + id);
  }

  getOrdersByEvent(id: number): Observable<FullOrderData[]> {
    return this.http.get<FullOrderData[]>(this._adminUrl + '/orders/' + id);
  }

  removeOrder(orderId: number): Observable<ApiResult> {
    return this.http.delete<ApiResult>(this._adminUrl + '/orders/' + orderId);
  }

  getOrderClient(order: number): Observable<Client> {
    return this.http.get<Client>(this._adminUrl + '/orders/userInfo/' + order);
  }

  getOrderPosLogs(order: number): Observable<PosPaymentLog[]> {
    return this.http.get<PosPaymentLog[]>(this._adminUrl + '/orders/posLogs/' + order);
  }

  getOrderLogs(order: number): Observable<OrderLog[]> {
    return this.http.get<OrderLog[]>(this._adminUrl + '/orders/logs/' + order);
  }

  resendEmail(order: number): Observable<ApiResult> {
    return this.http.get<ApiResult>(this._adminUrl + '/orders/resend/' + order);
  }

  createOrUpdateEvent(event: Event): Observable<number> {
    if (event.id) {
      return this.http.put<number>(this._adminUrl + '/events/' + event.id.toString(10), event);
    } else {
      return this.http.post<number>(this._adminUrl + '/events', event);
    }
  }

  createOrUpdateConfig(eventId: number, config: ScanConfiguration): Observable<number> {
    if (config.id) {
      return this.http.put<number>(this._scanUrl + '/configurations/' + eventId + '/' + config.id.toString(10), config);
    } else {
      return this.http.post<number>(this._scanUrl + '/configurations/' + eventId, config);
    }
  }

  createOrUpdatePosConfig(eventId: number, config: PosConfiguration): Observable<number> {
    if (config.id) {
      return this.http.put<number>(this._posUrl + '/configurations/' + eventId + '/' + config.id.toString(10), config);
    } else {
      return this.http.post<number>(this._posUrl + '/configurations/' + eventId, config);
    }
  }

  cloneEvent(toClone: number, event: Event): Observable<number> {
    return this.http.post<number>(this._adminUrl + '/events/clone/' + toClone, event);
  }

  getProduct(eventId: number, productId: number): Observable<Item> {
    return this.http.get<Item>(this._adminUrl + '/events/' + eventId + '/products/' + productId);
  }

  getScanningConfigurationsAcceptingProduct(product: number, event: number): Observable<ScanConfiguration[]> {
    return this.http.get<ScanConfiguration[]>(this._adminUrl + '/events/' + event + '/products/' + product + '/acceptedBy');
  }

  createOrUpdateProduct(eventId: number, product: Item): Observable<ApiResult> {
    if (product.id) {
      return this.http.put<ApiResult>(this._adminUrl + '/events/' + eventId + '/products/' + product.id, product);
    } else {
      return this.http.post<ApiResult>(this._adminUrl + '/events/' + eventId + '/products', product);
    }
  }

  purgeProducts(eventId: number): Observable<ApiResult> {
    return this.http.get<ApiResult>(this._adminUrl + '/events/' + eventId + '/products/purge');
  }

  deleteEvent(eventId: number): Observable<ApiResult> {
    return this.http.delete<ApiResult>(this._adminUrl + '/events/' + eventId);
  }

  deletePosConfig(eventId: number, configId: number): Observable<ApiResult> {
    return this.http.delete<ApiResult>(this._posUrl + '/configurations/' + eventId + '/' + configId);
  }

  deleteScanConfig(eventId: number, configId: number): Observable<ApiResult> {
    return this.http.delete<ApiResult>(this._scanUrl + '/configurations/' + eventId + '/' + configId);
  }

  getTicketData(ticket: string): Observable<TicketData> {
    return this.http.get<TicketData>(this._adminUrl + '/tickets/' + ticket);
  }

  getStats(event: number, start?: number, end?: number): Observable<StatsReturn[]> {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start.toString(10));
    }
    if (end) {
      params = params.append('end', end.toString(10));
    }
    return this.http.get<StatsReturn[]>(this._adminUrl + '/stats/' + event, {params: params});
  }

  getOrderStats(event: number, start?: number, end?: number, source?: Source): Observable<string> {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start.toString(10));
    }
    if (end) {
      params = params.append('end', end.toString(10));
    }
    if (source) {
      params = params.append('source', source.toString());
    }
    console.log(params);
    console.log(source);
    return this.http.get(this._adminUrl + '/stats/' + event + '/salesData.csv', {params: params, responseType: 'text'});
  }

  fnacExport(event: number, date: string): Observable<string> {
    return this.http.get(this._adminUrl + '/orders/export/' + event + '/' + date, {responseType: 'text'});
  }

  getItems(): Observable<ItemsResponse> {
    return this.http.get<ItemsResponse>(this._shopUrl + '/items');
  }

  getAllItems(): Observable<ItemsResponse> {
    return this.http.get<ItemsResponse>(this._shopUrl + '/items/all');
  }

  getInvisibleItems(): Observable<ItemsResponse> {
    return this.http.get<ItemsResponse>(this._shopUrl + '/items/invisible');
  }

  getPdf(barcode: string): Observable<Blob> {
    return this.http.get(this._ordersUrl + '/download/' + barcode + '.pdf', {responseType: 'blob'});
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this._ordersUrl + '/view');
  }

  getOrdersByUser(user: number): Observable<FullOrderData[]> {
    return this.http.get<FullOrderData[]>(this._adminUrl + '/orders/byUser/' + user);
  }

  getOrder(id: number): Observable<FullOrder> {
    return this.http.get<FullOrder>(this._ordersUrl + '/view/' + id);
  }

  login(ticket: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this._authUrl + '/login', ticket);
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http
      .get<LoginResponse>(this._authUrl + '/refresh');
  }

  firstLogin(data: any, token: string): Observable<LoginResponse> {
    data['ticket'] = token;
    return this.http
      .post<LoginResponse>(this._authUrl + '/firstLogin', data);
  }

  register(data: any): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._authUrl + '/signup', data);
  }

  placeOrder(items: CheckedOutItem[], source?: Source): Observable<CheckOutResponse> {
    return this.http
      .post<CheckOutResponse>(this._ordersUrl + '/create', {'items': items, 'orderType': source});
  }

  confirmOrder(orderId: number, targetEmail?: string): Observable<ApiResult> {

    return this.http
      .post<ApiResult>(this._adminUrl + '/orders/validate', {'orderId': orderId, 'targetEmail': targetEmail});
  }

  scanTicket(configId: number, ticketId: string): Observable<ScanResult> {
    return this.http
      .post<ScanResult>(this._scanUrl + '/process/' + configId, {'barcode': ticketId});
  }

  getAllScanningConfigurations(): Observable<ScanConfigurationList[]> {
    return this.http.get<ScanConfigurationList[]>(this._scanUrl + '/configurations');
  }

  getScanningConfigurations(eventId: number): Observable<ScanConfiguration[]> {
    return this.http.get<ScanConfiguration[]>(this._scanUrl + '/configurations/' + eventId);
  }

  getScanningConfiguration(eventId: number, id: number): Observable<ScanConfiguration> {
    return this.http.get<ScanConfiguration>(this._scanUrl + '/configurations/' + eventId + '/' + id);
  }

  addProductToScanningConfiguration(eventId: number, config: number, item: Item): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._scanUrl + '/configurations/' + eventId + '/' + config + '/addProduct', item.id.toString());
  }

  removeProductFromScanningConfiguration(eventId: number, config: number, item: Item): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._scanUrl + '/configurations/' + eventId + '/' + config + '/removeProduct', item.id.toString());
  }

  getFullScanningConfiguration(eventId: number, id: number): Observable<ScanConfigurationWithItems> {
    return this.http.get<any[]>(this._scanUrl + '/configurations/' + eventId + '/' + id + '/full')
      .map(val => {
        console.log(val);

        const config = val[0] as ScanConfiguration;
        config['items'] = val[1] as ItemList[];

        return config as ScanConfigurationWithItems;
      });
  }

  getAllPosConfigurations(): Observable<PosConfigurationList[]> {
    return this.http.get<PosConfigurationList[]>(this._posUrl + '/configurations');
  }

  getPosConfigurations(eventId: number): Observable<PosConfiguration[]> {
    return this.http.get<PosConfiguration[]>(this._posUrl + '/configurations/' + eventId);
  }

  getPosConfiguration(eventId: number, id: number): Observable<PosGetConfigResponse> {
    return this.http.get<PosGetConfigResponse>(this._posUrl + '/configurations/' + eventId + '/' + id);
  }

  addProductToPosConfiguration(eventId: number, config: number, item: Item, row: number, col: number, bgColor: string, fgColor: string): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._posUrl + '/configurations/' + eventId + '/' + config + '/addProduct', {
        productId: item.id,
        row: row, col: col, color: bgColor, textColor: fgColor
      });
  }

  removeProductFromPosConfiguration(eventId: number, config: number, item: Item): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._posUrl + '/configurations/' + eventId + '/' + config + '/removeProduct', item.id.toString());
  }

  placePosOrder(items: CheckedOutItem[]): Observable<PosOrderResponse> {
    return this.http
      .post<PosOrderResponse>(this._posUrl + '/checkout', {'items': items});
  }

  sendPosLog(orderId: number, log: PosPaymentLog): Observable<ApiResult> {
    return this.http
      .post<ApiResult>(this._posUrl + '/paymentLog/' + orderId, log);
  }

  importTickets(event: number, tickets: ImportedItemData[]): Observable<string> {
    return this.http
      .post(this._adminUrl + '/orders/import/' + event, tickets, {responseType: 'text'});
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this._adminUrl + '/users');
  }

  getClient(id: number): Observable<ClientAndPermissions> {
    return this.http.get<ClientAndPermissions>(this._adminUrl + '/users/' + id);
  }

  forceEmailConfirm(id: number): Observable<ApiResult> {
    return this.http.get<ApiResult>(this._adminUrl + '/users/' + id + '/acceptEmail');
  }

  addPermission(client: number, permission: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(this._adminUrl + '/users/' + client + '/permissions/add', permission);
  }

  removePermission(client: number, permission: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(this._adminUrl + '/users/' + client + '/permissions/remove', permission);
  }
}

export class CheckOutResponse extends ApiResult {
  ordered?: CheckedOutItem[];
  redirect?: string;
}


