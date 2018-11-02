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
  Source = Source;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(map => {
      const id = map.get('event');

      this.backend.getStats(Number(id)).subscribe(stats => {
        this.stats = stats;
        console.log(stats);
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


    return money + '  CHF (' + total + ')';

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
