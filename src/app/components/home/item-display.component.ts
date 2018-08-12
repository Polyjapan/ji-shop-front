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
    this.cart.addItem(this.item, 1, this.price);

    console.log(this.cart.items);
  }

  ngOnInit(): void {
    this.price = this.item.price;
  }
}
