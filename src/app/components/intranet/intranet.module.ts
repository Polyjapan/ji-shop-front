import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {IntranetRoutingModule} from './intranet-routing.module';
import {IntranetService} from './intranet.service';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {IntranetComponent} from './intranet.component';
import {SidebarModule} from '../sidebar/sidebar.module';
import {TasksService} from './tasks.service';
import {TasklistComponent} from './tasklist.component';
import {TasklistsComponent} from './tasklists.component';
import {IntranetEventComponent} from './intranet-event.component';
import {SelectEventComponent} from './select-event.component';

@NgModule({
  declarations: [
    IntranetComponent,
    TasklistComponent,
    TasklistsComponent,
    IntranetEventComponent,
    SelectEventComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    IntranetRoutingModule,
    SidebarModule
  ],
  providers: [ IntranetService, TasksService ]
})
export class IntranetModule { }
