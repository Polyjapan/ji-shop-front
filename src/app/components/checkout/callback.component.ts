import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../cart/cart.service';

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
