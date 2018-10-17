import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {PosComponent} from './pos.component';
import {CartModule} from '../cart/cart.module';
import {PosSelectComponent} from './pos-select.component';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SumupService} from './sumup.service';
import {PosCallbackComponent} from './pos-callback.component';

@NgModule({
  declarations: [
    PosComponent,
    PosSelectComponent,
    PosCallbackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    CartModule,
    RouterModule,
    NgbModule
  ],
  providers: [
    SumupService
  ]
})
export class PosModule {
}
