import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {Item, ItemList, ItemsResponse, PosConfigItem} from '../../types/items';
import {Observable} from 'rxjs/Rx';
import {Permissions} from '../../constants/permissions';
import {CartService} from '../cart/cart.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html'
})
export class PosComponent implements OnInit {
  items: PosConfigItem[][];
  loading = true;

  constructor(public backend: BackendService, private auth: AuthService, private cart: CartService,
              private route: ActivatedRoute) {
  }

  private buildRows(itemsArray: PosConfigItem[]): PosConfigItem[][] {
    let maxRow = 0;
    let maxCol = 0;

    for (const item of itemsArray) {
      if (item.row > maxRow) {
        maxRow = item.row;
      }
      if (item.col > maxCol) {
        maxCol = item.col;
      }
    }

    const items: PosConfigItem[][] = [];
    for (let col = 0; col <= maxCol; col++) {
      items.push([]);
      for (let row = 0; row <= maxRow; row++) {
        items[col].push(null);
      }
    }

    console.log(items);

    for (const item of itemsArray) {
      items[item.row][item.col] = item;
    }

    console.log(items);

    return items;
  }

  addItem(i: PosConfigItem): void {
    console.log(i);
    this.cart.addItem(i.item);
  }

  ngOnInit(): void {
    this.cart.clear(); // just in case
    const params = this.route.snapshot.paramMap;
    const configId = parseInt(params.get('configId'), 10);

    this.backend.getPosConfiguration(configId).subscribe(data => {
      this.items = this.buildRows(data.items);
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  getItemClasses(item: PosConfigItem): string {
    return ['pos-item', item.color, item.fontColor].join(' ');
  }

}
