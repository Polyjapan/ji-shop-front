import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BackendService} from './services/backend.service';
import {AuthModule} from './services/auth.module';
import {HomeComponent} from './components/home/home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {ItemListDisplayComponent} from './components/home/item-list-display.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ItemListDisplayComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,

    AppRoutingModule
  ],
  providers: [
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
