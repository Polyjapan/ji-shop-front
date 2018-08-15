import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {Router} from '@angular/router';
import {CartItem, CartService} from '../../services/cart.service';
import {CheckedOutItem, Source} from '../../types/order';
import {Item} from '../../types/items';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  checkoutErrors: string[] = null;
  checkoutRemoved: CartItem[] = null;
  checkoutUpdated: Map<string, number> = null;
  checkoutLink: string = null;

  constructor(private backend: BackendService, private auth: AuthService, private router: Router, public cart: CartService) {

  }

  wasUpdated(item: CartItem): boolean {
    return this.checkoutUpdated && this.checkoutUpdated.has(item.baseItem.id + '-' + item.price);
  }

  previousAmount(item: CartItem) {
    return this.checkoutUpdated.get(item.baseItem.id + '-' + item.price);
  }

  ngOnInit(): void {
    if (this.auth.requiresLogin('/checkout')) {
      // We are logged in
      // We send the request
      const order = this.cart.getOrder();
      console.log("<.>.>.>.<.<.");
      console.log(environment.apiurl);

      this.backend.placeOrder(order, Source.Web).subscribe(response => {
        // Build a map
        const netMap: Map<string, CheckedOutItem> = new Map<string, CheckedOutItem>();
        for (const item of response.ordered) {
          if (!this.cart.hasCartItem(item.itemId, item.itemPrice)) {
            this.checkoutErrors = ['Une erreur s\'est produite (des éléments ont été ajoutés à votre commande par le serveur)'];
            return;
          }

          netMap.set(item.itemId + '-' + item.itemPrice, item);
        }

        // Compare source array with map
        const removed: CartItem[] = [];
        const updated: Map<string, number> = new Map<string, number>();
        for (const item of order) {
          const key = item.itemId + '-' + item.itemPrice;
          const networkItem = netMap.get(key);

          if (!networkItem) {
            removed.push({price: item.itemPrice, amount: item.itemAmount, baseItem: this.cart.setItemById(item.itemId, item.itemPrice, 0)});
          } else if (networkItem.itemAmount !== item.itemAmount) {
            updated.set(key, item.itemAmount); // store the old amount
            this.cart.setItemById(item.itemId, item.itemPrice, networkItem.itemAmount);
          }
        }

        // Store everything
        if (updated.size > 0) {
          this.checkoutUpdated = updated;
        }
        if (removed.length > 0) {
          this.checkoutRemoved = removed;
        }
        this.checkoutLink = response.redirect;

      }, error => {
        this.checkoutErrors = [];
        for (const err of error.error.errors) {
          const apiErr = err as ApiError;
          for (const msg of apiErr.messages) {
            this.checkoutErrors.push(msg);
          }
        }
      });
    }
  }
}
