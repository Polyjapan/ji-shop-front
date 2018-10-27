import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {SalesData, StatsReturn} from '../../../types/stats';
import {FullOrderData, Order, Source} from '../../../types/order';
import {Item, ItemList} from '../../../types/items';
import {Event} from '../../../types/event';

@Component({
  selector: 'app-admin-list-orders',
  templateUrl: './admin-list-orders.component.html'
})
export class AdminListOrdersComponent implements OnInit {
  orders: FullOrderData[];

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.parent.parent.paramMap.get('event'));

    this.backend.getOrdersByEvent(id).subscribe(orders => {
      this.orders = orders;
    });
  }

  formatDate(time: number) {
    const date = new Date(time);

    return date.toLocaleString();
  }
}
