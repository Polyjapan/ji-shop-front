import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from './page-not-found.component';
import {HomeComponent} from './components/home/home.component';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CallbackComponent} from './components/checkout/callback.component';
import {EmailcheckComponent} from './components/authenticate/emailcheck.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AuthenticateComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'callback/:accepted', component: CallbackComponent },
  { path: 'emailConfirm/:email/:code', component: EmailcheckComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
