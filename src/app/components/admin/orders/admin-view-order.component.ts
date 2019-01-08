import {Component, Input, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {FullOrder, OrderLog} from '../../../types/order';
import {Client} from '../../../types/client';
import {PosPaymentLog} from '../../../types/pos_configuration';
import {AuthService} from '../../../services/auth.service';
import {Permissions} from '../../../constants/permissions';

@Component({
  selector: 'app-admin-view-order',
  templateUrl: './admin-view-order.component.html'
})
export class AdminViewOrderComponent implements OnInit {
  order: FullOrder;
  user: Client;
  orderLogs: PosPaymentLog[];
  logs: OrderLog[];
  @Input() id: number;
  working = false;
  deleting = false;
  sending = false;


  constructor(private backend: BackendService, private route: ActivatedRoute, private auth: AuthService) {
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      // This component can be embedded - in the later case, it doesn't get its id though URL params
      this.id = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.backend.getOrder(this.id).subscribe(ord => this.order = ord);
    this.backend.getOrderClient(this.id).subscribe(client => this.user = client);
    this.backend.getOrderPosLogs(this.id).subscribe(orderLogs => this.orderLogs = orderLogs);
    this.backend.getOrderLogs(this.id).subscribe(logs => this.logs = logs);
  }

  formatDate(time: number) {
    const date = new Date(time);

    return date.toLocaleString();
  }

  canAccept(): boolean {
    return this.auth.hasPermission(Permissions.FORCE_VALIDATION);
  }

  canDelete(): boolean {
    return this.auth.hasPermission(Permissions.ADMIN_REMOVE_ORDER);
  }

  canResend(): boolean {
    return this.auth.hasPermission(Permissions.FORCE_VALIDATION);
  }

  forceAccept() {
    if (!this.canAccept()) {
      return;
    }

    if (confirm('Voulez vous vraiment valider cette commande de force ? Les statistiques de ventes pourraient être faussées.')) {

      this.working = true;
      this.backend.confirmOrder(this.id).subscribe(res => {
        this.backend.getOrder(this.id).subscribe(ord => this.order = ord);
      });
    }
  }

  deleteOrder() {
    if (!this.canDelete()) {
      return;
    }

    if (
      confirm('Voulez vous vraiment supprimer cette commande ? L\'action est irréversible et tous les billets associés seront invalidés ' +
      'définitivement.') && confirm('ATTENTION ? Vous êtes vraiment vraiment certain de vouloir faire ça ? C\'est définitif on a dit.')
      && confirm('DERNIER AVERTISSEMENT ! J\'ai pas envie que tu fasses une bêtise, vraiment, mais si tu es sûr de vouloir ' +
      'SUPPRIMER cette commande pour toujours toujours alors tu peux cliquer.')
    ) {

      this.deleting = true;
      this.backend.removeOrder(this.id).subscribe(res => {
        this.backend.getOrder(this.id).subscribe(ord => this.order = ord);
      });
    }
  }

  resendEmail() {
    if (!this.canResend()) {
      return;
    }

    this.sending = true;
    this.backend.resendEmail(this.id).subscribe(res => {
      this.sending = false;
      alert('L\'Email a bien été renvoyé.');
    });

  }
}
