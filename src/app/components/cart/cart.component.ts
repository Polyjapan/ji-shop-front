import {Component, Input} from '@angular/core';
import {CartItem, CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  @Input() displayMode = false;
  @Input() theme = 'table';

  constructor(public cart: CartService) {
  }

  removeItem(item: CartItem) {
    this.cart.removeItem(item.baseItem, 1, item.price);

    console.log('remove item ' + item.baseItem.id);
  }
}
