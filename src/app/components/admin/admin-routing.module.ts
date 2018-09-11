import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  { path: 'scan', component: ScanSelectComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AdminRoutingModule {}
