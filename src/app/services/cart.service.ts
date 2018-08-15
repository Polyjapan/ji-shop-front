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

  countItem(item: Item): number {
    let amount = 0;
    for (const it of this.items) {
      if (item.id === it.baseItem.id) {
        amount += it.amount;
      }
    }
    return amount;
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

    let index = -1;

    // Search for the same item, if it exists
    for (const cartItem of this.items) {
      if (cartItem.baseItem.id === item.id) {
        if (cartItem.price === price) {
          cart = cartItem;
          index = this.items.indexOf(cartItem);

          break;
        }
      }
    }

    // Add the amount
    cart.amount += amount;

    if (cart.amount > 0) {
      if (index < 0) {
        this.items.push(cart);
      } else {
        this.items.splice(index, 1, cart);
      }
    } else if (index >= 0) {
      this.items.splice(index, 1);
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
