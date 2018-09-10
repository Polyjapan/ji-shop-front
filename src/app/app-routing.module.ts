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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AuthenticateComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'checkout/:ordertype', component: CheckoutComponent },
  { path: 'callback/:accepted', component: CallbackComponent },
  { path: 'emailConfirm/:email/:code', component: EmailcheckComponent },
  { path: 'passwordForget', component: ForgottenPasswordComponent },
  { path: 'passwordReset/:email/:code', component: RecoverPasswordComponent },
  { path: 'orders', component: MyOrdersComponent },
  { path: 'orders/:id', component: ViewOrderComponent },
  { path: 'scan/:configId', component: ScanComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
