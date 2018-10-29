import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionAuthGuard} from '../../services/permission-auth-guard.service';
import {Permissions} from '../../constants/permissions';
import {IntranetComponent} from './intranet.component';
import {TasklistsComponent} from './tasklists.component';
import {TaskState} from '../../types/intranet';
import {IntranetEventComponent} from './intranet-event.component';
import {SelectEventComponent} from './select-event.component';

const routes: Routes = [
  {
    path: 'intranet',
    component: IntranetComponent,
    canActivate: [PermissionAuthGuard],
    data: {permission: Permissions.INTRANET_VIEW},
    canActivateChild: [PermissionAuthGuard],
    children: [
      {
        path: '',
        component: SelectEventComponent,
      },
      {
        path: ':event',
        component: IntranetEventComponent,
        children: [
          {
            path: '',
            component: TasklistsComponent,
            data: {tag: 'home', acceptedStates: [TaskState.Sent, TaskState.Waiting, TaskState.InProgress]}
          },
          {
            path: 'closed',
            component: TasklistsComponent,
            data: {tag: 'closed', acceptedStates: [TaskState.Refused, TaskState.Done, TaskState.Dropped]}
          }
        ]
      }

      /*

  Sent = 'SENT',
  Refused = 'REFUSED',
  Waiting = 'WAITING',
  InProgress = 'INPROGRESS',
  Done = 'DONE',
  Dropped = 'DROPPED'
       */

      /*
      this.menu.push(new MenuItem('.', 'home', 'Vue générale', 'home'));
    this.menu.push(new MenuItem('my', 'my', 'Mes tâches', 'user'));
    this.menu.push(new MenuItem('closed', 'closed', 'Tâches fermées', 'folder'));
    this.menu.push(new MenuItem('create', 'create', 'Créer une tâche', 'plus-circle'));

       */
      /* {
         path: '',
         canActivateChild: [PermissionAuthGuard],
         children: [
           {path: '', component: AdminHomeComponent},
           {path: 'create', component: AdminCreateEventComponent},
           {path: 'clone/:cloneId', component: AdminCreateEventComponent},
           {path: 'users', component: AdminListUsersComponent},
           {path: 'users/:id', component: AdminViewUserComponent},
           {path: 'orders/:id', component: AdminViewOrderComponent},
           {
             path: 'scan',
             children: [
               {path: '', component: AdminSelectConfigComponent},
               {path: 'create', component: AdminCreateScanningConfigComponent},
               {path: ':id', component: AdminViewScanningConfigComponent},
               {path: ':id/update', component: AdminCreateScanningConfigComponent},
             ],
           },
           {
             path: 'pos',
             children: [
               {path: '', component: AdminSelectPosConfigComponent},
               {path: 'create', component: AdminCreatePosConfigComponent},
               {path: ':id', component: AdminViewPosConfigComponent},
               {path: ':id/update', component: AdminCreatePosConfigComponent},
             ],
           },
           {
             path: ':event',
             canActivateChild: [PermissionAuthGuard],
             component: AdminEventParentComponent,
             children: [
               {path: '', component: AdminEventComponent, data: {name: 'Menu principal'}},
               {path: 'stats', component: AdminShowStatsComponent, data: {name: 'Statistiques'}},
               {path: 'update', component: AdminCreateEventComponent, data: {name: 'Edition'}},
               {
                 path: 'import',
                 component: AdminUploadImportComponent,
                 data: {name: 'Importation Fnac', permission: Permissions.IMPORT_EXTERNAL}
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
             ]
           }
         ]
       }*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class IntranetRoutingModule {
}
