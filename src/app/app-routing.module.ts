import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from './page-not-found.component';
import {HomeComponent} from './components/home/home.component';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CallbackComponent} from './components/checkout/callback.component';
import {EmailcheckComponent} from './components/authenticate/emailcheck.component';
import {MyOrdersComponent} from './components/members/my-orders.component';
import {ViewOrderComponent} from './components/members/view-order.component';
import {ForgottenPasswordComponent} from './components/authenticate/forgotten-password.component';
import {RecoverPasswordComponent} from './components/authenticate/recover-password.component';
import {ScanComponent} from './components/scan/scan.component';
import {ScanSelectComponent} from './components/scan/scan-select.component';
import {PermissionAuthGuard} from './services/permission-auth-guard.service';
import {Permissions} from './constants/permissions';
import {PosComponent} from './components/pos/pos.component';
import {PosSelectComponent} from './components/pos/pos-select.component';
import {PosCallbackComponent} from './components/pos/pos-callback.component';
import {MainComponent} from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: AuthenticateComponent },
      { path: 'checkout', component: CheckoutComponent, canActivate: [PermissionAuthGuard] },
      { path: 'checkout/:ordertype', component: CheckoutComponent, canActivate: [PermissionAuthGuard] },
      { path: 'callback/:accepted', component: CallbackComponent },
      { path: 'emailConfirm/:email/:code', component: EmailcheckComponent },
      { path: 'passwordForget', component: ForgottenPasswordComponent },
      { path: 'passwordReset/:email/:code', component: RecoverPasswordComponent },
      { path: 'orders', component: MyOrdersComponent, canActivate: [PermissionAuthGuard] },
      { path: 'orders/:id', component: ViewOrderComponent, canActivate: [PermissionAuthGuard] },
      { path: 'scan/:configId', component: ScanComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SCAN_TICKET} },
      { path: 'scan', component: ScanSelectComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SCAN_TICKET} },
      { path: 'pos/:configId', component: PosComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SELL_ON_SITE} },
      { path: 'pos/:configId/callback', component: PosCallbackComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SELL_ON_SITE} },
      { path: 'pos', component: PosSelectComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SELL_ON_SITE} },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
