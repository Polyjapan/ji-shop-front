import {Component, Input} from '@angular/core';
import {CartItem, CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  constructor(public cart: CartService) {}
}
