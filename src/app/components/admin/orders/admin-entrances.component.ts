import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {EntranceStats, SalesData, StatsReturn} from '../../../types/stats';
import {Source} from '../../../types/order';
import * as Highcharts from 'highcharts';
import * as Moment from 'moment';
import * as mTZ from 'moment-timezone';

declare global {
  interface Window {
    moment: any;
  }
}
window.moment = Moment;
mTZ();

@Component({
  selector: 'app-admin-entrances',
  templateUrl: './admin-entrances.component.html'
})
export class AdminEntrancesComponent implements OnInit {
  private DAY = 24 * 3600 * 1000;
  private id: number;
  groupBy = 600;
  stats: EntranceStats;
  cumulative: EntranceStats;
  Highcharts = Highcharts;

  days: number[] = [];

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  private getSeries(day: number, type: string, source: EntranceStats, title: string, options?) {
    const start = Math.floor(day / this.DAY) * this.DAY;
    const end = start + this.DAY;

    const filter = (value: number[]) => value[0] >= start && value[0] < end;

    return {
      xAxis: {
        type: 'datetime',
        crosshair: true
      },

      title: {
        text: Moment(start).format('MMM Do YYYY') + ' - ' + title
      },

      plotOptions: {
        series: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#666666'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },

      time: {
        timezone: 'Europe/Zurich'
      },

      chart: {
        zoomType: 'x'
      },

      series: [
        {name: 'Entrées sur place', data: source.sold.filter(filter), type: type},
        {name: 'Billets scannés', data: source.scanned.filter(filter), type: type},
      ]
    };
  }

  series(day: number) {
    return this.getSeries(day, 'column', this.stats, 'Entrées');
  }

  seriesArea(day: number) {
    return this.getSeries(day, 'area', this.cumulative, 'Entrées cumulées');
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('event'), 10);
      this.reload();
    });

  }

  private computeCumulative(source: number[][]) {
    const target: number[][] = [];
    target.push([0, 0]);
    const self = this;

    source.forEach(function(elementToAdd, index) {
      const date = elementToAdd[0];
      const lastDate = target[index][0];
      const sameDay = Math.floor(date / self.DAY) === Math.floor(lastDate / self.DAY);

      const initValue = sameDay ? target[index][1] : 0;

      const newElement = [elementToAdd[0], initValue + elementToAdd[1]];
      target.push(newElement);
    });

    target.shift();
    return target;
  }

  reload() {
    this.stats = undefined;
    this.days = [];

    this.backend.getEntrances(this.id, this.groupBy).subscribe(stats => {
      this.cumulative = new EntranceStats();
      this.cumulative.sold = this.computeCumulative(stats.sold);
      this.cumulative.scanned = this.computeCumulative(stats.scanned);

      let lastDate = 0;
      for (const arr of stats.sold) {
        const date = arr[0];
        if (Math.floor(date / this.DAY) !== Math.floor(lastDate / this.DAY)) {
          this.days.push(date);
        }
        lastDate = date;
      }
      this.stats = stats;
    });
  }
}
