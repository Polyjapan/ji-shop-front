import {Component, Input, OnInit} from '@angular/core';
import {FullOrderData} from '../../types/order';

@Component({
  selector: 'app-admin-full-order-list',
  templateUrl: './admin-full-order-list.component.html'
})
export class AdminFullOrderListComponent {
  @Input() orders: FullOrderData[];
  @Input() routerLinkBase: string[] = [];

  constructor() {
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
