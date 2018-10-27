import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionAuthGuard} from '../../services/permission-auth-guard.service';
import {AdminHomeComponent} from './admin-home.component';
import {AdminComponent} from './admin.component';
import {Permissions} from '../../constants/permissions';
import {AdminShowStatsComponent} from './admin-show-stats.component';
import {AdminEventComponent} from './admin-event.component';
import {AdminEventParentComponent} from './admin-event-parent.component';
import {AdminCreateEventComponent} from './admin-create-event.component';
import {AdminListProductsComponent} from './admin-list-products.component';
import {AdminCreateProductComponent} from './admin-create-product.component';
import {AdminUploadImportComponent} from './admin-upload-import.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [PermissionAuthGuard],
    data: {permission: Permissions.ADMIN_ACCESS},
    children: [
      {
        path: '',
        canActivateChild: [PermissionAuthGuard],
        children: [
          {path: '', component: AdminHomeComponent},
          {path: 'create', component: AdminCreateEventComponent},
          {path: 'clone/:cloneId', component: AdminCreateEventComponent},
          {
            path: ':event',
            canActivateChild: [PermissionAuthGuard],
            component: AdminEventParentComponent,
            children: [
              {path: '', component: AdminEventComponent, data: {name: 'Menu principal'}},
              {path: 'stats', component: AdminShowStatsComponent, data: {name: 'Statistiques'}},
              {path: 'update', component: AdminCreateEventComponent, data: {name: 'Edition'}},
              {path: 'import', component: AdminUploadImportComponent, data: {name: 'Importation Fnac', permission: Permissions.IMPORT_EXTERNAL}},
              {
                path: 'products', data: {name: 'Produits'},
                children: [
                  {path: '', component: AdminListProductsComponent, data: {name: 'Liste'}},
                  {path: 'create', component: AdminCreateProductComponent, data: {name: 'Création'}},
                  {path: 'update/:productId', component: AdminCreateProductComponent, data: {name: 'Edition'}},
                ]
              },
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
