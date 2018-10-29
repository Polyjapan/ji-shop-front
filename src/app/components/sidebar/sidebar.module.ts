import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SidebarComponent} from './sidebar.component';
import {RouterModule} from '@angular/router';
import {SidebarMenuComponent} from './sidebar-menu.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarMenuComponent
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    SidebarComponent,
    SidebarMenuComponent
  ]
})
export class SidebarModule { }
