import {Component, Input} from '@angular/core';
import {CartItem, CartService} from './cart.service';

@Component({
  selector: 'app-cart-item-display',
  templateUrl: './cart-item-display.component.html'
})
export class CartItemDisplayComponent {
  @Input() item: CartItem = null;
  @Input() displayMode: boolean = false;

  constructor(private cart: CartService) {}

  removeItem() {
    this.cart.removeItem(this.item.baseItem, 1, this.item.price);

    console.log('remove item ' + this.item.baseItem.id);
  }




}
