import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../types/items';
import {CartService} from '../cart/cart.service';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styles: [
    `.strikethrough {position:relative}

    .strikethrough:before {
      position: absolute;
      content: "";
      left: -2px;
      top: 50%;
      right: -5px;
      border-top: 2px solid;
      border-color: red;

      -webkit-transform:rotate(-17deg);
      -moz-transform:rotate(-17deg);
      -ms-transform:rotate(-17deg);
      -o-transform:rotate(-17deg);
      transform:rotate(-17deg);
    }`
  ]
})
export class ItemDisplayComponent implements OnInit {
  @Input() item: Item = null;
  price: number;

  constructor(private cart: CartService) {}

  addItem() {
    if (this.canAddMore) {
      this.cart.addItem(this.item, 1, this.price);
    }
  }

  get amountAdded(): number {
    return this.cart.countItem(this.item);
  }

  get maxItems(): number {
    if (this.item.maxItems < 0 || this.item.maxItems > 20) {
      return 20;
    } else {
      return this.item.maxItems;
    }
  }

  get canAddMore(): boolean {
    return this.amountAdded < this.maxItems;
  }

  ngOnInit(): void {
    this.price = this.item.price;
  }

  computePriceReduction(item: Item) {
    const reduc = 100 * (item.estimatedRealPrice - item.price) / item.estimatedRealPrice;


    return '(- ' + reduc.toFixed(0) + ' %)';
  }
}
