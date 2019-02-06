import {Item} from './items';

export class Order {
  id: number;
  price: number;
  paymentConfirmed: boolean;
  createdAt: number;
  source: Source;
  removed: boolean;
}

export class FullOrderData {
  id: number;
  clientId: number;
  ticketsPrice: number;
  totalPrice: number;
  paymentConfirmed: number;
  enterDate: number;
  source: Source;
  removed: boolean;
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
  Web = 'WEB', OnSite = 'ONSITE', Reseller = 'RESELLER', Gift = 'GIFT', Physical = 'PHYSICAL'
}

export class CheckedOutItem {
  itemId: number;
  itemAmount: number;
  itemPrice?: number;
}

export class ImportedItemData {
  product: number;
  barcode: string;
  paidPrice: number;
  date: string;
  refunded: boolean;
}


export class OrderLog {
  id?: number;
  orderId: number;
  logDate: number;
  name: String;
  details?: String;
  accepted: String;
}
