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

export const Sources = [Source.Web, Source.OnSite, Source.Reseller, Source.Gift, Source.Physical];

export function sourceToHuman(s: Source) {
  switch (s) {
    case Source.Web:
      return 'En ligne';
    case Source.OnSite:
      return 'Sur place';
    case Source.Reseller:
      return 'Revendeur';
    case Source.Gift:
      return 'Cadeau';
    case Source.Physical:
      return 'Physique';
    default:
      return '???'
  }
}

export function sourceFromString(s: string) {
  const filtered = Sources.filter(src => s === src);
  return filtered.length > 0 ? filtered[0] : undefined;
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
