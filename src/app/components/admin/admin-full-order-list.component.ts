import {Component, Input, OnInit} from '@angular/core';
import {FullOrderData} from '../../types/order';

@Component({
  selector: 'app-admin-full-order-list',
  templateUrl: './admin-full-order-list.component.html'
})
export class AdminFullOrderListComponent {
  @Input() orders: FullOrderData[];
  @Input() routerLinkBase: string[] = [];
  displayRemoved: boolean = false;
  displayUnpaid: boolean = true;

  constructor() {
  }

  get filteredOrders(): FullOrderData[] {
    return this.orders.filter(order => {
      if (order.removed && !this.displayRemoved) {
        return false;
      }

      return order.paymentConfirmed || this.displayUnpaid;
    });
  }

  routerLink(id: number) {
    const routerLink: string[] = [];

    for (const part of this.routerLinkBase) {
      routerLink.push(part);
    }

    routerLink.push(id.toString(10));

    return routerLink;
  }

  formatDate(time: number) {
    const date = new Date(time);

    return date.toLocaleString();
  }
}
