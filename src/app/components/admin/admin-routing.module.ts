import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PermissionAuthGuard} from '../../services/permission-auth-guard.service';
import {AdminHomeComponent} from './admin-home.component';
import {AdminComponent} from './admin.component';
import {Permissions} from '../../constants/permissions';
import {AdminShowStatsComponent} from './admin-show-stats.component';
import {AdminEventComponent} from './admin-event.component';
import {AdminEventParentComponent} from './admin-event-parent.component';
import {AdminCreateEventComponent} from './admin-create-event.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [PermissionAuthGuard],
    data: { permission: Permissions.ADMIN_ACCESS },
    children: [
      {
        path: '',
        canActivateChild: [PermissionAuthGuard],
        children: [
          { path: '', component: AdminHomeComponent },
          { path: 'create', component: AdminCreateEventComponent },
          {
            path: ':event',
            canActivateChild: [PermissionAuthGuard],
            component: AdminEventParentComponent,
            children: [
              { path: '', component: AdminEventComponent },
              { path: 'stats', component: AdminShowStatsComponent },
              { path: 'update', component: AdminCreateEventComponent },
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AdminRoutingModule {}
