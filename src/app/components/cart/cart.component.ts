import {Component, Input} from '@angular/core';
import {CartItem, CartService} from './cart.service';
import {AuthService} from '../../services/auth.service';
import {Permissions} from '../../constants/permissions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  constructor(public cart: CartService) {}
}
