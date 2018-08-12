import {Component, Input} from '@angular/core';
import {CartItem, CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart-item-display',
  templateUrl: './cart-item-display.component.html'
})
export class CartItemDisplayComponent {
  @Input() item: CartItem = null;

  constructor(private cart: CartService) {}

  removeItem() {
    this.cart.removeItem(this.item.baseItem, 1, this.item.price);

    console.log(this.cart.items);
  }




}
