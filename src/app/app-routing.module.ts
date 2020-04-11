import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found.component';
import {HomeComponent} from './components/home/home.component';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CallbackComponent} from './components/checkout/callback.component';
import {MyOrdersComponent} from './components/members/my-orders.component';
import {ViewOrderComponent} from './components/members/view-order.component';
import {ScanComponent} from './components/scan/scan.component';
import {ScanSelectComponent} from './components/scan/scan-select.component';
import {PermissionAuthGuard} from './services/permission-auth-guard.service';
import {Permissions} from './constants/permissions';
import {PosComponent} from './components/pos/pos.component';
import {PosSelectComponent} from './components/pos/pos-select.component';
import {PosCallbackComponent} from './components/pos/pos-callback.component';
import {TermsComponent} from './components/home/terms.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: AuthenticateComponent},
  {path: 'terms', component: TermsComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [PermissionAuthGuard]},
  {path: 'checkout/:ordertype', component: CheckoutComponent, canActivate: [PermissionAuthGuard]},
  {path: 'callback/:accepted', component: CallbackComponent},
  {path: 'orders', component: MyOrdersComponent, canActivate: [PermissionAuthGuard]},
  {path: 'orders/:id', component: ViewOrderComponent, canActivate: [PermissionAuthGuard]},
  {path: 'scan/:configId', component: ScanComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SCAN_TICKET}},
  {path: 'scan', component: ScanSelectComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SCAN_TICKET}},
  {
    path: 'pos/:eventId/:configId',
    component: PosComponent,
    canActivate: [PermissionAuthGuard],
    data: {permission: Permissions.SELL_ON_SITE}
  },
  {
    path: 'pos/:eventId/:configId/callback',
    component: PosCallbackComponent,
    canActivate: [PermissionAuthGuard],
    data: {permission: Permissions.SELL_ON_SITE}
  },
  {path: 'pos', component: PosSelectComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SELL_ON_SITE}},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
