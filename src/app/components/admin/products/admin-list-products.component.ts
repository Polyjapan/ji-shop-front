import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {SalesData, StatsReturn} from '../../../types/stats';
import {Source} from '../../../types/order';
import {Item, ItemList} from '../../../types/items';
import {Event} from '../../../types/event';

@Component({
  selector: 'app-admin-list-products',
  templateUrl: './admin-list-products.component.html'
})
export class AdminListProductsComponent implements OnInit {
  items: Item[];

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.parent.parent.paramMap.get('event'));

    this.backend.getProducts(id).subscribe(items => {
      this.items = items;
    });
  }
}
