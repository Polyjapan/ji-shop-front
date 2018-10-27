import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {OrderContentComponent} from './order-content.component';

@NgModule({
  declarations: [
    OrderContentComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    OrderContentComponent
  ]
})
export class OrderContentModule {
}
