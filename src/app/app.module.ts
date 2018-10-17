import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BackendService} from './services/backend.service';
import {AuthModule, tokenGetter} from './services/auth.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {HomeModule} from './components/home/home.module';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../environments/environment';
import {CallbackComponent} from './components/checkout/callback.component';
import {EmailcheckComponent} from './components/authenticate/emailcheck.component';
import {MyOrdersComponent} from './components/members/my-orders.component';
import {ViewOrderComponent} from './components/members/view-order.component';
import {RecoverPasswordComponent} from './components/authenticate/recover-password.component';
import {ForgottenPasswordComponent} from './components/authenticate/forgotten-password.component';
import {ScanComponent} from './components/scan/scan.component';
import {ScanSelectComponent} from './components/scan/scan-select.component';
import {PermissionAuthGuard} from './services/permission-auth-guard.service';
import {AdminModule} from './components/admin/admin.module';
import {PosModule} from './components/pos/pos.module';
import {RecaptchaModule} from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    CallbackComponent,
    EmailcheckComponent,
    MyOrdersComponent,
    ViewOrderComponent,
    RecoverPasswordComponent,
    ForgottenPasswordComponent,
    ScanComponent,
    ScanSelectComponent,

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
    RecaptchaModule.forRoot(),

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelist
      }
    }),

    AppRoutingModule
  ],
  providers: [
    BackendService,
    PermissionAuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
