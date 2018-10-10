import {NgModule} from '@angular/core';
import {CartItemDisplayComponent} from './cart-item-display.component';
import {CartComponent} from './cart.component';
import {BrowserModule} from '@angular/platform-browser';
import {CartService} from './cart.service';

@NgModule({
  declarations: [
    CartItemDisplayComponent,
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
export class CartModule { }
