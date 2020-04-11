import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, Injectable, Injector, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BackendService} from './services/backend.service';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../environments/environment';
import {CallbackComponent} from './components/checkout/callback.component';
import {MyOrdersComponent} from './components/members/my-orders.component';
import {ViewOrderComponent} from './components/members/view-order.component';
import {ScanComponent} from './components/scan/scan.component';
import {ScanSelectComponent} from './components/scan/scan-select.component';
import {PermissionAuthGuard} from './services/permission-auth-guard.service';
import {RecaptchaModule} from 'ng-recaptcha';
import {MainComponent} from './main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import * as Sentry from '@sentry/browser';
import {Severity} from '@sentry/browser';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ItemDisplayComponent} from './components/home/item-display.component';
import {ItemListDisplayComponent} from './components/home/item-list-display.component';
import {HomeComponent} from './components/home/home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {TermsComponent} from './components/home/terms.component';
import {CartComponent} from './components/cart/cart.component';
import {CartService} from './services/cart.service';
import {AuthService} from './services/auth.service';
import {AuthApiService} from './services/authapi.service';
import {PosComponent} from './components/pos/pos.component';
import {PosSelectComponent} from './components/pos/pos-select.component';
import {PosCallbackComponent} from './components/pos/pos-callback.component';
import {SumupService} from './services/sumup.service';
import {OrderContentComponent} from './components/members/order-content.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {EventService} from './services/event.service';
import {EventListService} from './services/event-list.service';
import {AdminComponent} from './components/admin/admin.component';
import {AdminHomeComponent} from './components/admin/admin-home.component';
import {AdminSelectEditionComponent} from './components/admin/editions/admin-select-edition.component';
import {AdminShowStatsComponent} from './components/admin/orders/admin-show-stats.component';
import {AdminEventSidebarComponent} from './components/admin/editions/admin-event-sidebar.component';
import {AdminEventParentComponent} from './components/admin/editions/admin-event-parent.component';
import {AdminCreateEventComponent} from './components/admin/editions/admin-create-event.component';
import {AdminListProductsComponent} from './components/admin/products/admin-list-products.component';
import {AdminCreateProductComponent} from './components/admin/products/admin-create-product.component';
import {AdminUploadImportComponent} from './components/admin/orders/admin-upload-import.component';
import {AdminListOrdersComponent} from './components/admin/orders/admin-list-orders.component';
import {AdminViewOrderComponent} from './components/admin/orders/admin-view-order.component';
import {AdminFullOrderListComponent} from './components/admin/admin-full-order-list.component';
import {AdminListUsersComponent} from './components/admin/users/admin-list-users.component';
import {AdminViewUserComponent} from './components/admin/users/admin-view-user.component';
import {AdminCreateScanningConfigComponent} from './components/admin/scan/admin-create-scanning-config.component';
import {AdminSelectConfigComponent} from './components/admin/scan/admin-select-config.component';
import {AdminViewScanningConfigComponent} from './components/admin/scan/admin-view-scanning-config.component';
import {AdminCreatePosConfigComponent} from './components/admin/pos/admin-create-pos-config.component';
import {AdminSelectPosConfigComponent} from './components/admin/pos/admin-select-pos-config.component';
import {AdminViewPosConfigComponent} from './components/admin/pos/admin-view-pos-config.component';
import {AdminViewPosItemComponent} from './components/admin/pos/admin-view-pos-item.component';
import {AdminDownloadExportComponent} from './components/admin/orders/admin-download-export.component';
import {AdminViewTicketComponent} from './components/admin/ticketTracking/admin-view-ticket.component';
import {AdminUploadsComponent} from './components/admin/uploads/admin-uploads.component';
import {AdminEntrancesComponent} from './components/admin/orders/admin-entrances.component';
import {AdminSalesComponent} from './components/admin/orders/admin-sales.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {SidebarMenuComponent} from './components/sidebar/sidebar-menu.component';

if (environment.production) {
  Sentry.init({
    dsn: 'https://2cb1ffaf5a934ef9b91661ecd6bcd8c7@sentry.io/2124798'
  });
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
  }

  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({eventId});
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private _injector: Injector,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap(event => {
        }, error => {
          if (error && error.error) {
            console.log(error);
            Sentry.captureMessage('HTTP Request failed: ' + req.method + ' ' +
              req.url + ' => ' + error.status + ' ' + error.message, Severity.Error);
          }
        })
      );
  }
}


export function tokenGetter() {
  return localStorage.getItem(AuthService.ID_TOKEN_KEY);
}

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    CallbackComponent,
    MyOrdersComponent,
    ViewOrderComponent,
    ScanComponent,
    ScanSelectComponent,
    MainComponent,
    ItemDisplayComponent,
    ItemListDisplayComponent,
    HomeComponent,
    PageNotFoundComponent,
    TermsComponent,
    CartComponent,
    AuthenticateComponent,
    PosComponent,
    PosSelectComponent,
    PosCallbackComponent,
    OrderContentComponent,
    AdminComponent,
    AdminHomeComponent,
    AdminSelectEditionComponent,
    AdminShowStatsComponent,
    AdminEventSidebarComponent,
    AdminEventParentComponent,
    AdminCreateEventComponent,
    AdminListProductsComponent,
    AdminCreateProductComponent,
    AdminUploadImportComponent,
    AdminListOrdersComponent,
    AdminViewOrderComponent,
    AdminFullOrderListComponent,
    AdminListUsersComponent,
    AdminViewUserComponent,
    AdminCreateScanningConfigComponent,
    AdminSelectConfigComponent,
    AdminViewScanningConfigComponent,
    AdminCreatePosConfigComponent,
    AdminSelectPosConfigComponent,
    AdminViewPosConfigComponent,
    AdminViewPosItemComponent,
    AdminDownloadExportComponent,
    AdminViewTicketComponent,
    AdminUploadsComponent,
    AdminEntrancesComponent,
    AdminSalesComponent,
    SidebarComponent,
    SidebarMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HighchartsChartModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelist
      }
    }),
    RecaptchaModule.forRoot(),
  ],
  providers: [
    {provide: ErrorHandler, useClass: SentryErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    BackendService,
    PermissionAuthGuard,
    CartService,
    AuthService,
    AuthApiService,

    SumupService,
    EventService,
    EventListService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
