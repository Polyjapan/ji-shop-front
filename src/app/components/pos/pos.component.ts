import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {Item, ItemList, ItemsResponse, SoldItem} from '../../types/items';
import {Observable} from 'rxjs/Rx';
import {Permissions} from '../../constants/permissions';
import {CartService} from '../cart/cart.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html'
})
export class PosComponent implements OnInit {
  items: SoldItem[][];
  loading = true;

  constructor(public backend: BackendService, private auth: AuthService, private cart: CartService) {
  }

  private buildRows(itemsArray: SoldItem[]): SoldItem[][] {
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

    const items: SoldItem[][] = [];
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


  test(i: SoldItem): void {
    console.log('Clicked item ');
    console.log(i);
    this.cart.addItem(i.item);
  }

  private buildTestItem(data: any, price: number): SoldItem {
    const item: Item = {id: data.id, name: data.displayName, longDescription: null, description: null, isVisible: true, isTicket: true, maxItems: -1, eventId: -1, freePrice: false, price};
    return {item: item, textColor: data.textColor, color: data.color, row: data.row, col: data.col};
  }

  ngOnInit(): void {
    this.cart.clear(); // just in case

    const items: SoldItem[] = [];
    let i = 0;

    items.push(this.buildTestItem({id: ++i, displayName: 'Oishi Noir', col: 0, row: 0, color: 'bg-primary', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Oishi Vert', col: 1, row: 0, color: 'bg-success', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Oishi Jaune', col: 2, row: 0, color: 'bg-warning', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Mikado', col: 0, row: 1, color: 'bg-primary', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Mikado White', col: 1, row: 1, color: 'bg-success', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Mikado Milk', col: 2, row: 1, color: 'bg-warning', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Cup Chicken', col: 0, row: 2, color: 'bg-primary', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Cup Pork', col: 1, row: 2, color: 'bg-success', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Cup Beef', col: 2, row: 2, color: 'bg-warning', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Cup Shrimps', col: 3, row: 2, color: 'bg-warning', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Cup Vege', col: 4, row: 2, color: 'bg-warning', textColor: 'text-white'}, 3));
    items.push(this.buildTestItem({id: ++i, displayName: 'Udon 1', col: 0, row: 3, color: 'bg-primary', textColor: 'text-white'}, 6));
    items.push(this.buildTestItem({id: ++i, displayName: 'Udon 2', col: 1, row: 3, color: 'bg-success', textColor: 'text-white'}, 6));
    items.push(this.buildTestItem({id: ++i, displayName: 'Udon 3', col: 2, row: 3, color: 'bg-warning', textColor: 'text-white'}, 6));

    this.items = this.buildRows(items);
  }

  getItemClasses(item: SoldItem): string {
    return ['pos-item', item.color, item.textColor].join(' ');
  }

}
