import {NgModule} from '@angular/core';
import {CartComponent} from './cart.component';
import {BrowserModule} from '@angular/platform-browser';
import {CartService} from './cart.service';

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CartService
  ],
  exports: [
    CartComponent
  ]
})
export class CartModule {
}
