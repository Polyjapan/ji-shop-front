import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {IntranetRoutingModule} from './intranet-routing.module';
import {IntranetService} from './intranet.service';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {IntranetComponent} from './intranet.component';

@NgModule({
  declarations: [
    IntranetComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    IntranetRoutingModule,
  ],
  providers: [ IntranetService ]
})
export class IntranetModule { }
