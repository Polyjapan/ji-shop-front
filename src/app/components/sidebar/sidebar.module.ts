import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SidebarComponent} from './sidebar.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
