import {NgModule} from '@angular/core';
import {ItemDisplayComponent} from './item-display.component';
import {ItemListDisplayComponent} from './item-list-display.component';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from '../../page-not-found.component';
import {CartItemDisplayComponent} from './cart-item-display.component';
import {CartComponent} from './cart.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {CartService} from '../../services/cart.service';

@NgModule({
  declarations: [
    ItemDisplayComponent,
    ItemListDisplayComponent,
    HomeComponent,
    PageNotFoundComponent,
    CartItemDisplayComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule
  ],
  providers: [
    CartService
  ]
})
export class HomeModule { }
