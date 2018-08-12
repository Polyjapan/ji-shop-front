import {Injectable} from '@angular/core';
import {Item} from '../types/items';

@Injectable()
export class CartService {
  items: CartItem[] = [];
  total = 0;

  private save() {
    localStorage.setItem('_cart', JSON.stringify(this.items));
  }

  private load() {
    if (localStorage.getItem('_cart')) {
      this.items = JSON.parse(localStorage.getItem('_cart')) as CartItem[];

      this.refreshTotal();
    }
  }

  constructor() {
    this.load();
  }

  removeItem(item: Item, amountToRemove?: number, price?: number) {
    if (!amountToRemove) {
      amountToRemove = 1;
    }

    this.addItem(item, -amountToRemove, price);
  }

  addItem(item: Item, amount?: number, price?: number) {
    if (!amount) {
      amount = 1;
    }

    if (!price || !item.freePrice) {
      price = item.price;
    }

    let cart = new CartItem();
    cart.baseItem = item;
    cart.amount = 0;
    cart.price = price;

    // Search for the same item, if it exists
    for (const cartItem of this.items) {
      if (cartItem.baseItem === item) {
        if (cartItem.price === price) {
          cart = cartItem;
          this.items.splice(this.items.indexOf(cartItem));
          break;
        }
      }
    }

    // Add the amount
    cart.amount += amount;

    if (cart.amount > 0) {
      this.items.push(cart);
    }

    this.refreshTotal();
    this.save();
  }

  private refreshTotal() {
    let total = 0;
    for (const it of this.items) {
      total += it.price * it.amount;
    }

    this.total = total;
  }
}

export class CartItem {
  baseItem: Item;
  amount: number;
  price?: number;
}
