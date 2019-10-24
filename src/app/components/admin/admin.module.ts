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
import {AdminEventSidebarComponent} from './editions/admin-event-sidebar.component';
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
import {AdminCreateScanningConfigComponent} from './scan/admin-create-scanning-config.component';
import {AdminSelectConfigComponent} from './scan/admin-select-config.component';
import {AdminViewScanningConfigComponent} from './scan/admin-view-scanning-config.component';
import {AdminCreatePosConfigComponent} from './pos/admin-create-pos-config.component';
import {AdminSelectPosConfigComponent} from './pos/admin-select-pos-config.component';
import {AdminViewPosConfigComponent} from './pos/admin-view-pos-config.component';
import {AdminViewPosItemComponent} from './pos/admin-view-pos-item.component';
import {SidebarModule} from '../sidebar/sidebar.module';
import {EventListService} from './event-list.service';
import {AdminDownloadExportComponent} from './orders/admin-download-export.component';
import {AdminViewTicketComponent} from './ticketTracking/admin-view-ticket.component';
import {AdminUploadsComponent} from './uploads/admin-uploads.component';
import {AdminEntrancesComponent} from './orders/admin-entrances.component';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminSelectEditionComponent,
    AdminShowStatsComponent,
    AdminEventSidebarComponent,
    AdminEventParentComponent,
    AdminCreateEventComponent,
    AdminListProductsComponent,
    AdminCreateProductComponent,
    AdminUploadImportComponent,
    AdminListOrdersComponent,
    AdminViewOrderComponent,
    AdminFullOrderListComponent,
    AdminListUsersComponent,
    AdminViewUserComponent,
    AdminCreateScanningConfigComponent,
    AdminSelectConfigComponent,
    AdminViewScanningConfigComponent,
    AdminCreatePosConfigComponent,
    AdminSelectPosConfigComponent,
    AdminViewPosConfigComponent,
    AdminViewPosItemComponent,
    AdminDownloadExportComponent,
    AdminViewTicketComponent,
    AdminUploadsComponent,
    AdminEntrancesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    AdminRoutingModule,
    OrderContentModule,
    SidebarModule,
    HighchartsChartModule
  ],
  providers: [ EventService, EventListService ]
})
export class AdminModule { }
