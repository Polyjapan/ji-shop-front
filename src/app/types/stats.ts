import {Source} from './order';
import {Item} from './items';

export class StatsReturn {
  product: Item;
  salesData: Map<Source, SalesData>;
}

export class EntranceStats {
  sold: number[][];
  scanned: number[][];
}

export class SalesData {
  amountSold: number;
  moneyGenerated: number;
  moneyGeneratedCash?: number; // SPECIAL for ONSITE: amount sold by cash
  moneyGeneratedCard?: number; // SPECIAL for ONSITE: amount sold by card
}
