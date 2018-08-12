import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BackendService} from './services/backend.service';
import {AuthModule} from './services/auth.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {HomeModule} from './components/home/home.module';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';

@NgModule({
  declarations: [
    AppComponent,

    AuthenticateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    HomeModule,

    AppRoutingModule
  ],
  providers: [
    BackendService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
