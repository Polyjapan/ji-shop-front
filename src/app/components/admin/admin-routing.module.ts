import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PermissionAuthGuard} from '../../services/permission-auth-guard.service';
import {AdminHomeComponent} from './admin-home.component';
import {AdminComponent} from './admin.component';
import {Permissions} from '../../constants/permissions';
import {AdminShowStatsComponent} from './admin-show-stats.component';

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
          { path: 'stats/:event', component: AdminShowStatsComponent },
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
