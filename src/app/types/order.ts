import {Item} from './items';

export class Order {
  id: number;
  price: number;
  paymentConfirmed: boolean;
  createdAt: number;
  source: Source;
}

export class OrderedProduct {
  product: Item;
  paidPrice: number;
  amount: number;
  codes: string[];
}

export class FullOrder {
  order: Order;
  products: OrderedProduct[];
  orderCode?: string;
}

export enum Source {
  Web, OnSite, Reseller, Gift
}


export class CheckedOutItem {
  itemId: number;
  itemAmount: number;
  itemPrice?: number;
}
