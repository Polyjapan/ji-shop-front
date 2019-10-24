import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionAuthGuard} from '../../services/permission-auth-guard.service';
import {AdminHomeComponent} from './admin-home.component';
import {AdminComponent} from './admin.component';
import {Permissions} from '../../constants/permissions';
import {AdminShowStatsComponent} from './orders/admin-show-stats.component';
import {AdminEventSidebarComponent} from './editions/admin-event-sidebar.component';
import {AdminEventParentComponent} from './editions/admin-event-parent.component';
import {AdminCreateEventComponent} from './editions/admin-create-event.component';
import {AdminListProductsComponent} from './products/admin-list-products.component';
import {AdminCreateProductComponent} from './products/admin-create-product.component';
import {AdminUploadImportComponent} from './orders/admin-upload-import.component';
import {AdminListOrdersComponent} from './orders/admin-list-orders.component';
import {AdminViewOrderComponent} from './orders/admin-view-order.component';
import {AdminListUsersComponent} from './users/admin-list-users.component';
import {AdminViewUserComponent} from './users/admin-view-user.component';
import {AdminSelectConfigComponent} from './scan/admin-select-config.component';
import {AdminCreateScanningConfigComponent} from './scan/admin-create-scanning-config.component';
import {AdminViewScanningConfigComponent} from './scan/admin-view-scanning-config.component';
import {AdminSelectPosConfigComponent} from './pos/admin-select-pos-config.component';
import {AdminCreatePosConfigComponent} from './pos/admin-create-pos-config.component';
import {AdminViewPosConfigComponent} from './pos/admin-view-pos-config.component';
import {AdminDownloadExportComponent} from './orders/admin-download-export.component';
import {AdminViewTicketComponent} from './ticketTracking/admin-view-ticket.component';
import {AdminEntrancesComponent} from './orders/admin-entrances.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [PermissionAuthGuard],
    data: {permission: Permissions.ADMIN_ACCESS},
    children: [
      {
        path: '', component: AdminHomeComponent,
        data: {tag: 'home'}
      },
      {path: 'users', component: AdminListUsersComponent, data: {tag: 'users'}},
      {path: 'tickets', component: AdminViewTicketComponent, data: {tag: 'tickets'}},
      {path: 'users/:id', component: AdminViewUserComponent, data: {tag: 'users'}},
      {path: 'orders/:id', component: AdminViewOrderComponent},
      {
        path: 'events', data: {tag: 'events'},
        children: [
          {path: 'create', component: AdminCreateEventComponent},
          {path: 'clone/:cloneId', component: AdminCreateEventComponent},
          {
            path: ':event',
            canActivateChild: [PermissionAuthGuard],
            component: AdminEventParentComponent,
            children: [
              {path: '', redirectTo: 'stats', pathMatch: 'full'},
              {path: 'stats', component: AdminShowStatsComponent, data: {name: 'Statistiques'}},
              {path: 'graphs', component: AdminEntrancesComponent, data: {name: 'Statistiques'}},
              {path: 'update', component: AdminCreateEventComponent, data: {name: 'Edition'}},
              {
                path: 'import',
                component: AdminUploadImportComponent,
                data: {name: 'Importation Fnac', permission: Permissions.IMPORT_EXTERNAL}
              },
              {
                path: 'export',
                component: AdminDownloadExportComponent,
                data: {name: 'Exportation', permission: Permissions.IMPORT_EXTERNAL}
              },
              {
                path: 'products', data: {name: 'Produits'},
                children: [
                  {path: '', component: AdminListProductsComponent, data: {name: 'Liste'}},
                  {path: 'create', component: AdminCreateProductComponent, data: {name: 'Création'}},
                  {path: 'update/:productId', component: AdminCreateProductComponent, data: {name: 'Edition'}},
                ]
              },
              {
                path: 'orders', data: {name: 'Commandes'},
                children: [
                  {path: '', component: AdminListOrdersComponent, data: {name: 'Liste'}},
                  {path: ':id', component: AdminViewOrderComponent, data: {name: 'Contenu de la commande'}},
                ]
              },
              {
                path: 'scan', data: {tag: 'scan'},
                children: [
                  {path: '', component: AdminSelectConfigComponent},
                  {path: 'create', component: AdminCreateScanningConfigComponent},
                  {path: ':id', component: AdminViewScanningConfigComponent},
                  {path: ':id/update', component: AdminCreateScanningConfigComponent},
                ],
              },
              {
                path: 'pos', data: {tag: 'pos'},
                children: [
                  {path: '', component: AdminSelectPosConfigComponent},
                  {path: 'create', component: AdminCreatePosConfigComponent},
                  {path: ':id', component: AdminViewPosConfigComponent},
                  {path: ':id/update', component: AdminCreatePosConfigComponent},
                ],
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
