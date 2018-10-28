import {Item, ItemList} from './items';

export class ScanConfiguration {
  id: number;
  name: string;
  acceptOrderTickets: boolean;
}

export class ScanConfigurationWithItems extends ScanConfiguration {
  items: ItemList[];
}
