import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {PosComponent} from './pos.component';
import {CartModule} from '../cart/cart.module';

@NgModule({
  declarations: [
    PosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    CartModule
  ],
  providers: [
    // Probably a service for sumup
  ]
})
export class PosModule {
}
