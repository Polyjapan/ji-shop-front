import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from './app-routing.module';
import {AuthService} from './services/auth.service';
import {BackendService} from './services/backend.service';
import {AuthModule} from './services/auth.module';
import {HomeComponent} from './components/home/home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {ItemListDisplayComponent} from './components/home/item-list-display.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemListDisplayComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AuthModule,

    AppRoutingModule
  ],
  providers: [
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
