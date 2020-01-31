import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {Order} from '../../types/order';
import * as Errors from '../../constants/errors';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[];
  errors: string[];

  constructor(public auth: AuthService, private backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.getOrders().subscribe(orders => {
      this.orders = orders.filter(order => !order.removed).sort((a, b) => {
        return b.createdAt - a.createdAt;
      }).filter(order => order.paymentConfirmed); // only display paid orders
    }, error => {
      this.errors = Errors.replaceErrorsInResponse(error);
    });
  }

  formatDate(order: Order) {
    const date = new Date(order.createdAt);

    return date.toLocaleString();
  }
}
