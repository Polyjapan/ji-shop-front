import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {FullOrder} from '../../../types/order';
import {Client} from '../../../types/client';
import {PosPaymentLog} from '../../../types/pos_configuration';

@Component({
  selector: 'app-admin-view-order',
  templateUrl: './admin-view-order.component.html'
})
export class AdminViewOrderComponent implements OnInit {
  order: FullOrder;
  user: Client;
  logs: PosPaymentLog[];
  id: number;
  working = false;
  sending = false;


  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.backend.getOrder(this.id).subscribe(ord => this.order = ord);
    this.backend.getOrderClient(this.id).subscribe(client => this.user = client);
    this.backend.getOrderLogs(this.id).subscribe(logs => this.logs = logs);
  }

  formatDate(time: number) {
    const date = new Date(time);

    return date.toLocaleString();
  }

  forceAccept() {
    if (confirm('Voulez vous vraiment valider cette commande de force ? Les statistiques de ventes pourraient être faussées.')) {

      this.working = true;
      this.backend.confirmOrder(this.id).subscribe(res => {
        this.backend.getOrder(this.id).subscribe(ord => this.order = ord);
      });
    }
  }

  resendEmail() {
    this.sending = true;
    this.backend.resendEmail(this.id).subscribe(res => {
      this.sending = false;
      alert('L\'Email a bien été renvoyé.');
    });

  }
}
