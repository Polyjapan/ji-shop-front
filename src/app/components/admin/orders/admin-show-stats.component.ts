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
  stats: StatsReturn[];
  totalAmountForSource: Map<string, number> = new Map();
  totalItemsForSource: Map<string, number> = new Map();
  cashAmount: number;
  cardAmount: number;
  Source = Source;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(map => {
      const id = map.get('event');
      this.totalItemsForSource.clear();
      this.totalAmountForSource.clear();
      this.cashAmount = undefined;
      this.cardAmount = undefined;

      this.backend.getStats(Number(id)).subscribe(stats => {
        this.stats = stats;
        console.log(stats);

        this.computeCashCard();
      });
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

    return this.totalAmountForSource.get(source) + '  CHF (' + this.totalAmountForSource.get(source) + ')';
  }

  shouldDisplay(source: string): boolean {
    this.computePriceTotalForSource(source);

    return this.totalItemsForSource.get(source) > 0;
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
        if (data[key].moneyGeneratedCard) {
          card += data[key].moneyGeneratedCard;
        }

        if (data[key].moneyGeneratedCash) {
          cash += data[key].moneyGeneratedCash;
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


}
