import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {ActivatedRoute, Router} from '@angular/router';
import {CartItem, CartService} from '../../services/cart.service';
import {CheckedOutItem, Order, Source} from '../../types/order';
import {Item} from '../../types/items';
import {environment} from '../../../environments/environment';
import {DateFormatter} from '../../../../node_modules/@angular/common/src/pipes/deprecated/intl';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[];

  constructor(public auth: AuthService, private backend: BackendService) {
  }

  ngOnInit(): void {
    if (this.auth.requiresLogin('/orders')) {
      this.backend.getOrders().subscribe(orders => {
        this.orders = orders.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      }, error => {

      });
    }
  }

  formatDate(order: Order) {
    const date = new Date(order.createdAt);

    return date.toLocaleString();
  }
}
