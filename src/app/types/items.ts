import { Event } from './event';


export class Item {
  id?: number;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  maxItems: number;
  eventId: number;
  isTicket: boolean;
  freePrice: boolean;
  isVisible: boolean;
  image?: string;
  isWebExclusive: boolean;
  estimatedRealPrice: number;
}

export class ItemList {
  event: Event;
  goodies?: boolean;
  items: Item[];
}

export class ItemsResponse {
  tickets: ItemList[];
  goodies: ItemList[];
}

export class PosConfigItem {
  item: Item;
  row: number;
  col: number;
  color: string;
  fontColor: string;
}
