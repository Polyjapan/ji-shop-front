import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {ActivatedRoute, Router} from '@angular/router';
import {CartItem, CartService} from '../../services/cart.service';
import {CheckedOutItem, Source} from '../../types/order';
import {Item} from '../../types/items';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html'
})
export class CallbackComponent implements OnInit {
  accepted: boolean;

  constructor(public cart: CartService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.accepted = this.route.snapshot.paramMap.get('accepted').toLowerCase() === 'true';

    if (this.accepted) {
      this.cart.clear();
    }
  }
}
