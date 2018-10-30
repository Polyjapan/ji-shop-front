import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {IntranetRoutingModule} from './intranet-routing.module';
import {IntranetService} from './intranet.service';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {IntranetComponent} from './selection/intranet.component';
import {SidebarModule} from '../sidebar/sidebar.module';
import {TasksService} from './tasks.service';
import {TasklistComponent} from './tasklists/tasklist.component';
import {TasklistsComponent} from './tasklists/tasklists.component';
import {IntranetEventComponent} from './layout/intranet-event.component';
import {SelectEventComponent} from './selection/select-event.component';
import {CreateTaskComponent} from './create/create-task.component';
import {ViewTaskComponent} from './view/view-task.component';

@NgModule({
  declarations: [
    IntranetComponent,
    TasklistComponent,
    TasklistsComponent,
    IntranetEventComponent,
    SelectEventComponent,
    CreateTaskComponent,
    ViewTaskComponent
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
