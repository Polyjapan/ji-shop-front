import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {SalesData, StatsReturn} from '../../../types/stats';
import {Source} from '../../../types/order';

@Component({
  selector: 'app-admin-show-stats',
  templateUrl: './admin-show-stats.component.html'
})
export class AdminShowStatsComponent implements OnInit {
  private id: number;
  stats: StatsReturn[];
  totalAmountForSource: Map<string, number> = new Map();
  totalItemsForSource: Map<string, number> = new Map();
  cashAmount: number;
  cardAmount: number;
  Source = Source;

  startDate: string;
  endDate: string;

  effectiveStart: Date;
  effectiveEnd: Date;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('event'), 10);

      this.reload();
    });

  }

  private reload() {
    this.stats = undefined;
    this.totalItemsForSource.clear();
    this.totalAmountForSource.clear();
    this.cashAmount = undefined;
    this.cardAmount = undefined;

    this.backend.getStats(this.id, this.effectiveStart, this.effectiveEnd).subscribe(stats => {
      this.stats = stats;
      console.log(stats);

      this.computeCashCard();
    });
  }

  priceStats(data: SalesData) {
    if (data) {
      return data.moneyGenerated + ' CHF (' + data.amountSold + ')';
    } else {
      return '0 CHF (0)';
    }
  }

  priceTotalForSource(source?: string) {
    this.computePriceTotalForSource(source);

    if (!source) {
      source = '__global';
    }

    return this.totalAmountForSource.get(source) + '  CHF (' + this.totalItemsForSource.get(source) + ')';
  }

  shouldDisplay(source: string): boolean {
    this.computePriceTotalForSource(source);

    return this.totalItemsForSource.get(source) > 0;
  }

  paymentMethodSalesData(salesData: SalesData) {
    const cash = salesData ? salesData.moneyGeneratedCash : undefined;
    const card = salesData ? salesData.moneyGeneratedCard : undefined;

    return this.paymentMethodData(cash, card);
  }

  paymentMethodData(cash?: number, card?: number) {
    cash = cash ? cash : 0;
    card = card ? card : 0;

    return 'Cash: ' + cash + ' CHF, card: ' + card + ' CHF';
  }

  private computeCashCard() {
    if (this.cardAmount && this.cashAmount) {
      return;
    }

    let card = 0, cash = 0;


    for (const stat of this.stats) {
      const data = stat.salesData;
      for (const key in data) {
        if (data[key]) {
          if (data[key].moneyGeneratedCard) {
            card += data[key].moneyGeneratedCard;
          }

          if (data[key].moneyGeneratedCash) {
            cash += data[key].moneyGeneratedCash;
          }
        }
      }
    }

    this.cardAmount = card;
    this.cashAmount = cash;
  }

  private computePriceTotalForSource(source?: string) {
    const src = source ? source : '__global';

    if (this.totalAmountForSource.has(src) && this.totalItemsForSource.has(src)) {
      return;
    }

    let total = 0;
    let money = 0;

    for (const stat of this.stats) {
      if (source) {
        const data = stat.salesData[source];
        if (data) {
          total += data.amountSold;
          money += data.moneyGenerated;
        }
      } else {
        const data = stat.salesData;
        for (const key in data) {
          total += data[key].amountSold;
          money += data[key].moneyGenerated;
        }
      }

    }

    this.totalAmountForSource.set(src, money);
    this.totalItemsForSource.set(src, total);
  }

  priceTotal(data: Map<Source, SalesData>) {
    let amt = 0;
    let money = 0;

    for (const key in data) {
      amt += data[key].amountSold;
      money += data[key].moneyGenerated;
    }

    return amt + ' (' + money + ' CHF)';
  }

  private parseTime(str: string) {
    console.log('Parse time ' + str);
    const parts = str.split(' ');
    const date = parts[0].split('/');

    if (date.length < 3)
      return;

    const day = Number.parseInt(date[0], 10);
    const month = Number.parseInt(date[1], 10);
    const year = Number.parseInt(date[2], 10);

    if (day > 31 || day < 1 || month < 1 || month > 12 || year < 2010 || year > 2100)
      return undefined; // What do you mean "2100 is to soon" ?

    let hour = 0, minute = 0, second = 0;

    if (parts.length >= 2) {
      const time = parts[1].split(':');

      if (time.length < 2)
        return undefined;

      hour = Number.parseInt(time[0], 10);
      minute = Number.parseInt(time[1], 10);
      second = time.length > 2 ? Number.parseInt(time[2], 10) : 0;
    }

    return new Date(year, month - 1, day, hour, minute, second);

  }

  updateFilter() {
    console.log(this.effectiveEnd);

    this.effectiveStart = undefined;
    this.effectiveEnd = undefined;
    let changed = false;

    console.log("Heyyyy i am updating yo " + this.startDate + " " + this.endDate);

    if (this.startDate) {
      this.effectiveStart = this.parseTime(this.startDate);
      changed = true;
    }

    if (this.endDate) {
      this.effectiveEnd = this.parseTime(this.endDate);
      console.log(this.effectiveEnd);
      changed = true;
    }

    if (changed) {
      this.reload();
    }
  }
}
