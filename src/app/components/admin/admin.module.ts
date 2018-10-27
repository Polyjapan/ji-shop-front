import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AdminComponent} from './admin.component';
import {AdminHomeComponent} from './admin-home.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminSelectEditionComponent} from './admin-select-edition.component';
import {AdminShowStatsComponent} from './admin-show-stats.component';
import {AdminEventComponent} from './admin-event.component';
import {AdminEventParentComponent} from './admin-event-parent.component';
import {AdminCreateEventComponent} from './admin-create-event.component';
import {EventService} from './event.service';
import {AdminListProductsComponent} from './admin-list-products.component';
import {AdminCreateProductComponent} from './admin-create-product.component';
import {AdminUploadImportComponent} from './admin-upload-import.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminSelectEditionComponent,
    AdminShowStatsComponent,
    AdminEventComponent,
    AdminEventParentComponent,
    AdminCreateEventComponent,
    AdminListProductsComponent,
    AdminCreateProductComponent,
    AdminUploadImportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    AdminRoutingModule
  ],
  providers: [ EventService ]
})
export class AdminModule { }
