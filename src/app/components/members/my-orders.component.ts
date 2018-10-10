import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {ActivatedRoute, Router} from '@angular/router';
import {CartItem, CartService} from '../cart/cart.service';
import {CheckedOutItem, Order, Source} from '../../types/order';
import {Item} from '../../types/items';
import {environment} from '../../../environments/environment';
import {DateFormatter} from '../../../../node_modules/@angular/common/src/pipes/deprecated/intl';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';

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
      this.orders = orders.sort((a, b) => {
        return b.createdAt - a.createdAt;
      }).filter(order => order.paymentConfirmed); // only display paid orders
    }, error => {
      this.errors = Errors.replaceErrors(error.error.errors);
    });
  }

  formatDate(order: Order) {
    const date = new Date(order.createdAt);

    return date.toLocaleString();
  }
}
