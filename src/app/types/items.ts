export class ItemsResponse {
  tickets: ItemList[];
  goodies: ItemList[];
}

export class ItemList {
  event: Event;
  items: Item[];
}

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
}
