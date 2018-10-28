import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AdminComponent} from './admin.component';
import {AdminHomeComponent} from './admin-home.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '../../services/auth.module';
import {FormsModule} from '@angular/forms';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminSelectEditionComponent} from './editions/admin-select-edition.component';
import {AdminShowStatsComponent} from './orders/admin-show-stats.component';
import {AdminEventComponent} from './editions/admin-event.component';
import {AdminEventParentComponent} from './editions/admin-event-parent.component';
import {AdminCreateEventComponent} from './editions/admin-create-event.component';
import {EventService} from './event.service';
import {AdminListProductsComponent} from './products/admin-list-products.component';
import {AdminCreateProductComponent} from './products/admin-create-product.component';
import {AdminUploadImportComponent} from './orders/admin-upload-import.component';
import {AdminListOrdersComponent} from './orders/admin-list-orders.component';
import {AdminViewOrderComponent} from './orders/admin-view-order.component';
import {OrderContentModule} from '../members/order-content.module';
import {AdminFullOrderListComponent} from './admin-full-order-list.component';
import {AdminListUsersComponent} from './users/admin-list-users.component';
import {AdminViewUserComponent} from './users/admin-view-user.component';

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
    AdminUploadImportComponent,
    AdminListOrdersComponent,
    AdminViewOrderComponent,
    AdminFullOrderListComponent,
    AdminListUsersComponent,
    AdminViewUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    AdminRoutingModule,
    OrderContentModule
  ],
  providers: [ EventService ]
})
export class AdminModule { }
