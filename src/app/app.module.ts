import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, Injectable, Injector, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BackendService} from './services/backend.service';
import {AuthModule} from './services/auth.module';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {HomeModule} from './components/home/home.module';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CallbackComponent} from './components/checkout/callback.component';
import {MyOrdersComponent} from './components/members/my-orders.component';
import {ViewOrderComponent} from './components/members/view-order.component';
import {ScanComponent} from './components/scan/scan.component';
import {ScanSelectComponent} from './components/scan/scan-select.component';
import {PermissionAuthGuard} from './services/permission-auth-guard.service';
import {AdminModule} from './components/admin/admin.module';
import {PosModule} from './components/pos/pos.module';
import {RecaptchaModule} from 'ng-recaptcha';
import {OrderContentModule} from './components/members/order-content.module';
import {MainComponent} from './main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import * as Sentry from '@sentry/browser';
import {Severity} from '@sentry/browser';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

Sentry.init({
  dsn: 'https://2cb1ffaf5a934ef9b91661ecd6bcd8c7@sentry.io/2124798'
});

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
            Sentry.captureMessage('HTTP Request failed: ' + req.method + ' ' + req.url + ' => ' + error.status + ' ' + error.message, Severity.Error);
          }
        })
      );
  }
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

    AuthenticateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    HomeModule,
    AdminModule,
    PosModule,
    OrderContentModule,
    RecaptchaModule.forRoot(),
    BrowserAnimationsModule,

    AppRoutingModule
  ],
  providers: [
    {provide: ErrorHandler, useClass: SentryErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    BackendService,
    PermissionAuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
