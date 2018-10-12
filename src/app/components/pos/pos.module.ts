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

@NgModule({
  declarations: [
    PosComponent,
    PosSelectComponent
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
    // Probably a service for sumup
  ]
})
export class PosModule {
}
