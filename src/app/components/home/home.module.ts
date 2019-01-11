import {NgModule} from '@angular/core';
import {ItemDisplayComponent} from './item-display.component';
import {ItemListDisplayComponent} from './item-list-display.component';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from '../../page-not-found.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {CartModule} from '../cart/cart.module';
import {TermsComponent} from './terms.component';

@NgModule({
  declarations: [
    ItemDisplayComponent,
    ItemListDisplayComponent,
    HomeComponent,
    PageNotFoundComponent,
    TermsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    CartModule
  ],
  providers: []
})
export class HomeModule { }
