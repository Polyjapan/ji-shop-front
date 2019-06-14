import {Item, ItemList} from './items';
import {Event} from './event';

export class ScanConfiguration {
  id: number;
  eventId: number;
  name: string;
  acceptOrderTickets: boolean;
}

export class ScanConfigurationWithItems extends ScanConfiguration {
  items: ItemList[];
}

export class ScanConfigurationList {
  event: Event;
  configs: ScanConfiguration[];
}
