import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found.component';
import {HomeComponent} from './components/home/home.component';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CallbackComponent} from './components/checkout/callback.component';
import {MyOrdersComponent} from './components/members/my-orders.component';
import {ViewOrderComponent} from './components/members/view-order.component';
import {ScanComponent} from './components/scan/scan.component';
import {ScanSelectComponent} from './components/scan/scan-select.component';
import {PermissionAuthGuard} from './services/permission-auth-guard.service';
import {Permissions} from './constants/permissions';
import {PosComponent} from './components/pos/pos.component';
import {PosSelectComponent} from './components/pos/pos-select.component';
import {PosCallbackComponent} from './components/pos/pos-callback.component';
import {MainComponent} from './main.component';
import {TermsComponent} from './components/home/terms.component';
import {AdminComponent} from './components/admin/admin.component';
import {AdminHomeComponent} from './components/admin/admin-home.component';
import {AdminListUsersComponent} from './components/admin/users/admin-list-users.component';
import {AdminViewTicketComponent} from './components/admin/ticketTracking/admin-view-ticket.component';
import {AdminViewUserComponent} from './components/admin/users/admin-view-user.component';
import {AdminViewOrderComponent} from './components/admin/orders/admin-view-order.component';
import {AdminCreateEventComponent} from './components/admin/editions/admin-create-event.component';
import {AdminEventParentComponent} from './components/admin/editions/admin-event-parent.component';
import {AdminShowStatsComponent} from './components/admin/orders/admin-show-stats.component';
import {AdminEntrancesComponent} from './components/admin/orders/admin-entrances.component';
import {AdminUploadImportComponent} from './components/admin/orders/admin-upload-import.component';
import {AdminDownloadExportComponent} from './components/admin/orders/admin-download-export.component';
import {AdminListProductsComponent} from './components/admin/products/admin-list-products.component';
import {AdminCreateProductComponent} from './components/admin/products/admin-create-product.component';
import {AdminListOrdersComponent} from './components/admin/orders/admin-list-orders.component';
import {AdminSelectConfigComponent} from './components/admin/scan/admin-select-config.component';
import {AdminCreateScanningConfigComponent} from './components/admin/scan/admin-create-scanning-config.component';
import {AdminViewScanningConfigComponent} from './components/admin/scan/admin-view-scanning-config.component';
import {AdminSelectPosConfigComponent} from './components/admin/pos/admin-select-pos-config.component';
import {AdminCreatePosConfigComponent} from './components/admin/pos/admin-create-pos-config.component';
import {AdminViewPosConfigComponent} from './components/admin/pos/admin-view-pos-config.component';

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
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'login', component: AuthenticateComponent},
      {path: 'terms', component: TermsComponent},
      {path: 'checkout', component: CheckoutComponent, canActivate: [PermissionAuthGuard]},
      {path: 'checkout/:ordertype', component: CheckoutComponent, canActivate: [PermissionAuthGuard]},
      {path: 'callback/:accepted', component: CallbackComponent},
      {path: 'orders', component: MyOrdersComponent, canActivate: [PermissionAuthGuard]},
      {path: 'orders/:id', component: ViewOrderComponent, canActivate: [PermissionAuthGuard]},
      {path: 'scan/:configId', component: ScanComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SCAN_TICKET}},
      {path: 'scan', component: ScanSelectComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SCAN_TICKET}},
      {
        path: 'pos/:eventId/:configId',
        component: PosComponent,
        canActivate: [PermissionAuthGuard],
        data: {permission: Permissions.SELL_ON_SITE}
      },
      {
        path: 'pos/:eventId/:configId/callback',
        component: PosCallbackComponent,
        canActivate: [PermissionAuthGuard],
        data: {permission: Permissions.SELL_ON_SITE}
      },
      {path: 'pos', component: PosSelectComponent, canActivate: [PermissionAuthGuard], data: {permission: Permissions.SELL_ON_SITE}},
      {path: '**', component: PageNotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
