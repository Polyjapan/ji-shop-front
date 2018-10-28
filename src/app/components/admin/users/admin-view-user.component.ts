import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {FullOrderData} from '../../../types/order';
import {ClientAndPermissions} from '../../../types/client';
import {Permissions} from '../../../constants/permissions';

@Component({
  selector: 'app-admin-view-user',
  templateUrl: './admin-view-user.component.html'
})
export class AdminViewUserComponent implements OnInit {
  user: ClientAndPermissions;
  orders: FullOrderData[];
  id: number;
  Permissions = Permissions;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.reloadUser();
    this.backend.getOrdersByUser(this.id).subscribe(orders => this.orders = orders);
  }

  private reloadUser() {
    this.backend.getClient(this.id).subscribe(user => {
      this.user = user;
    });
  }

  formatDate(time: number) {
    const date = new Date(time);

    return date.toLocaleString();
  }

  deletePermission(perm: string) {
    this.backend.removePermission(this.id, perm).subscribe(rep => this.reloadUser());
  }

  addPermission(perm: HTMLInputElement) {
    this.backend.addPermission(this.id, perm.value).subscribe(rep => {
      this.reloadUser();
      perm.value = '';
    });
  }

  forceEmailConfirm() {
    if (confirm('Voulez vous vraiment valider cette adresse e-mail ? Elle pourraît être fausse.')) {
      this.backend.forceEmailConfirm(this.id).subscribe(res => this.reloadUser());
    }
  }
}
