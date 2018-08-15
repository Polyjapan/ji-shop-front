import {Component, Input} from '@angular/core';
import {CartItem, CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {Permissions} from '../../constants/permissions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  constructor(public cart: CartService, public auth: AuthService) {}

  get isAdmin() {
    return this.auth.hasPermission(Permissions.GIVE_FOR_FREE);
  }
}
