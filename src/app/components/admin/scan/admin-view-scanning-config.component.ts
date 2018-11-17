import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ScanConfigurationWithItems} from '../../../types/scan_configuration';
import {BackendService} from '../../../services/backend.service';
import {Item, ItemList} from '../../../types/items';

@Component({
  selector: 'app-admin-view-scanning-config',
  templateUrl: './admin-view-scanning-config.component.html'
})
export class AdminViewScanningConfigComponent implements OnInit {
  config: ScanConfigurationWithItems = null;
  private addedItems: number[];
  private availableItems: ItemList[];
  filteredAvailableItems: ItemList[];
  private id: number;

  constructor(private backend: BackendService, public route: ActivatedRoute, private router: Router) {
  }

  private buildAddedItems() {
    this.addedItems = [];

    for (const list of this.config.items) {
      for (const item of list.items) {
        this.addedItems.push(item.id);
      }
    }
  }

  private reload() {
    this.backend.getFullScanningConfiguration(this.id).subscribe(res => {
      this.config = res;

      this.buildAddedItems();
      this.filterAvailableItems();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      if (!map.has('id') || !map.get('id')) {
        return;
      }

      this.id = Number(map.get('id'));

      this.reload();
      this.backend.getInvisibleItems().subscribe(res => {
        this.availableItems = res.tickets;
        this.filterAvailableItems();
      });
    });
  }

  private filterAvailableItems() {
    if (!this.addedItems) {
      this.filteredAvailableItems = this.availableItems;
      return;
    }

    if (!this.availableItems) {
      return;
    }

    this.filteredAvailableItems = this.availableItems.map(list => {
      return {event: list.event, items: list.items.filter(it => this.addedItems.indexOf(it.id) === -1)};
    }).filter(list => list.items.length > 0);
  }

  addProduct(product: Item) {
    this.backend.addProductToScanningConfiguration(this.id, product).subscribe(res => this.reload());
  }

  removeProduct(product: Item) {
    this.backend.removeProductFromScanningConfiguration(this.id, product).subscribe(res => this.reload());
  }

  delete(): void {
    const conf = confirm('Voulez vous vraiment supprimer cette configuration ? Elle sera définitivement perdue.');

    if (conf) {
      this.backend.deleteScanConfig(this.id).subscribe(res => {
        this.router.navigate(['admin', 'scan']);
      }, err => {
        alert('Une erreur s\'est produite.');
        this.reload();
      });
    }
  }
}
