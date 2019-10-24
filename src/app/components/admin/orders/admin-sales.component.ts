import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {EntranceStats, SalesData, StatsReturn} from '../../../types/stats';
import {Source, sourceFromString, sourceToHuman} from '../../../types/order';
import * as Highcharts from 'highcharts';
import * as Moment from 'moment';
import * as mTZ from 'moment-timezone';

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.component.html'
})
export class AdminSalesComponent implements OnInit {
  private id: number;
  groupBy = 24;
  stats: Map<Source, number[][]>;
  cumulative: Map<Source, number[][]>;
  Highcharts = Highcharts;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  private getSeries(type: string, source: Map<Source, number[][]>, title: string) {
    const series = [];

    source.forEach((val, key) => series.push(
      {name: sourceToHuman(key), data: val, type: type},
    ));

    return {
      xAxis: {
        type: 'datetime',
        crosshair: true
      },
      title: {
        text: title
      },
      plotOptions: {
        series: {
          connectNulls: true,
          pointPlacement: 'between',
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

      series: series
    };
  }

  get series() {
    return this.getSeries('column', this.stats, 'Ventes par période');
  }

  get seriesArea() {
    return this.getSeries('area', this.cumulative, 'Ventes cumulées');
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
    source.forEach(function(elementToAdd, index) {
      const newElement = [elementToAdd[0], target[index][1] + elementToAdd[1]];
      target.push(newElement);
    });

    target.shift();
    return target;
  }

  reload() {
    this.stats = undefined;

    this.backend.getSales(this.id, this.groupBy).subscribe(stats => {
      this.cumulative = new Map<Source, number[][]>();
      this.stats = new Map<Source, number[][]>();

      for (const src in stats) {
        this.stats.set(sourceFromString(src), stats[src]);
        this.cumulative.set(sourceFromString(src), this.computeCumulative(stats[src]));
      }

      console.log(this.stats);
    });
  }
}
