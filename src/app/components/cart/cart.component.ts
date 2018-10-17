import {Component, Input} from '@angular/core';
import {CartItem, CartService} from './cart.service';
import {AuthService} from '../../services/auth.service';
import {Permissions} from '../../constants/permissions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  @Input() displayMode = false;

  constructor(public cart: CartService) {
  }

  removeItem(item: CartItem) {
    this.cart.removeItem(item.baseItem, 1, item.price);

    console.log('remove item ' + item.baseItem.id);
  }
}
