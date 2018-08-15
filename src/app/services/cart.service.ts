import {Injectable} from '@angular/core';
import {Item} from '../types/items';
import {CheckedOutItem} from '../types/order';

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

  getOrder(): CheckedOutItem[] {
    return this.items.map((value: CartItem) => {
      return {itemId: value.baseItem.id, itemPrice: value.price, itemAmount: value.amount};
    });
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

  hasCartItem(id: number, price: number) {
    return this.findCartItem(id, price).index !== -1;
  }

  private findCartItem(itemId: number, itemPrice: number, def?: CartItem) {
    let cart: CartItem = def;
    let index = -1;
    // Search for the same item, if it exists
    for (const cartItem of this.items) {
      if (cartItem.baseItem.id === itemId) {
        if (cartItem.price === itemPrice) {
          cart = cartItem;
          index = this.items.indexOf(cartItem);

          break;
        }
      }
    }

    return {cart: cart, index: index};
  }

  private updateCart(cart: CartItem, index: number) {
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

  setItemById(itemId: number, itemPrice: number, amount: number): Item {
    const result = this.findCartItem(itemId, itemPrice);
    const cart = result.cart;
    const index = result.index;

    // Add the amount
    cart.amount = amount;
    this.updateCart(cart, index);

    return cart.baseItem;
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

    const result = this.findCartItem(item.id, price, cart);
    cart = result.cart;
    const index = result.index;

    // Add the amount
    cart.amount += amount;

    this.updateCart(cart, index);
  }

  private refreshTotal() {
    let total = 0;
    for (const it of this.items) {
      total += it.price * it.amount;
    }

    this.total = total;
  }

  clear() {
    this.items = [];
    this.save();
    this.refreshTotal();
  }
}

export class CartItem {
  baseItem: Item;
  amount: number;
  price?: number;
}
