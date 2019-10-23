import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {SalesData, StatsReturn} from '../../../types/stats';
import {Source} from '../../../types/order';
import {hasOwnProperty} from 'tslint/lib/utils';

@Component({
  selector: 'app-admin-show-stats',
  templateUrl: './admin-show-stats.component.html',
  styles: [
      `
          .total-line {
              border-top: 3px solid black;
              border-bottom: 3px solid black;
              font-weight: bolder;
          }
    `
  ]
})
export class AdminShowStatsComponent implements OnInit {
  stats: StatsReturn[];

  Source = Source;
  columns: { type: Source, title: string }[] = [];
  startDate: string;
  endDate: string;
  effectiveStart: Date;
  effectiveEnd: Date;
  private id: number;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  get ticketStats() {
    return this.stats.filter((value) => value.product.isTicket);
  }

  get goodiesStats() {
    return this.stats.filter((value) => !value.product.isTicket);
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('event'), 10);

      this.reload();
    });

  }

  computeTotal(type: 'goodies' | 'tickets' | 'all', source?: Source) {
    let cash = 0;
    let card = 0;
    let total = 0;
    let items = 0;

    for (const line of this.stats) {
      if (type === 'all' || (type === 'tickets' && line.product.isTicket) || (type === 'goodies' && !line.product.isTicket)) {
        if (source) {
          if (line.salesData[source]) {
            const value = line.salesData[source];
            total += value.moneyGenerated;
            if (value.moneyGeneratedCash) cash += value.moneyGeneratedCash;
            if (value.moneyGeneratedCard) card += value.moneyGeneratedCard;
            items += value.amountSold;

            console.log(card + ' - ' + cash);
          }
        } else {
          for (const k in line.salesData) {
            if (hasOwnProperty(line.salesData, k)) {
              const value = line.salesData[k];
              total += value.moneyGenerated;
              if (value.moneyGeneratedCash) cash += value.moneyGeneratedCash;
              if (value.moneyGeneratedCard) card += value.moneyGeneratedCard;
              items += value.amountSold;
            }
          }
        }
      }
    }

    return this.formatLine(cash, card, total, items);
  }

  getCol(source: Source, item: StatsReturn) {
    const value: SalesData = item.salesData[source];

    if (value) {
      return this.formatLine(value.moneyGeneratedCash, value.moneyGeneratedCard, value.moneyGenerated, value.amountSold);
    } else {
      return this.formatLine(0, 0, 0, 0);
    }
  }

  getTotal(item: StatsReturn) {
    let cash = 0;
    let card = 0;
    let total = 0;
    let items = 0;

    for (const k in item.salesData) {
      if (hasOwnProperty(item.salesData, k)) {
        const value = item.salesData[k];
        total += value.moneyGenerated;
        cash += value.moneyGeneratedCash;
        card += value.moneyGeneratedCard;
        items += value.amountSold;
      }
    }

    return this.formatLine(cash, card, total, items);
  }

  updateFilter() {
    console.log(this.effectiveEnd);

    this.effectiveStart = undefined;
    this.effectiveEnd = undefined;
    let changed = false;

    console.log('Heyyyy i am updating yo ' + this.startDate + ' ' + this.endDate);

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

  private reload() {
    this.stats = undefined;
    this.columns = [];

    this.backend.getStats(this.id, this.effectiveStart, this.effectiveEnd).subscribe(stats => {
      this.stats = stats;

      this.checkStatsFor(Source.Web, stats, 'En ligne');
      this.checkStatsFor(Source.OnSite, stats, 'Sur place');
      this.checkStatsFor(Source.Gift, stats, 'Cadeau');
      this.checkStatsFor(Source.Reseller, stats, 'Import');
      this.checkStatsFor(Source.Physical, stats, 'Physiques');
    });
  }

  private formatCurrency(n) {
    return (new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(n));
  }

  private formatNum(n) {
    return (new Intl.NumberFormat('fr-CH').format(n));
  }

  private formatLine(cash, card, total, items) {
    let str = this.formatNum(items) + '\t (' + this.formatCurrency(total) + ')';
    if (cash > 0) str += '<br><i>Cash: ' + this.formatCurrency(cash) + '</i>';
    if (card > 0) str += '<br><i>Carte: ' + this.formatCurrency(card) + '</i>';

    return str;
  }

  private checkStatsFor(source: Source, stats: StatsReturn[], colTitle: string) {
    for (const line of stats) {
      if (line.salesData[source]) {
        this.columns.push({type: source, title: colTitle});
        return;
      }
    }
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
}
