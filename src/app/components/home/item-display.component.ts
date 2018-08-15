import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {Item, ItemList} from '../../types/items';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html'
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
}
