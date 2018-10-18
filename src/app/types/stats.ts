import {Source} from './order';
import {Item} from './items';

export class StatsReturn {
  product: Item;
  salesData: Map<Source, SalesData>;
}

export class SalesData {
  amountSold: number;
  moneyGenerated: number;
}
