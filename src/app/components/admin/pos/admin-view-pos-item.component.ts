import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ScanConfigurationWithItems} from '../../../types/scan_configuration';
import {BackendService} from '../../../services/backend.service';
import {Item, ItemList, PosConfigItem} from '../../../types/items';
import {PosConfiguration} from '../../../types/pos_configuration';

@Component({
  selector: 'app-admin-view-pos-item',
  templateUrl: './admin-view-pos-item.component.html'
})
export class AdminViewPosItemComponent {
  @Input() item: Item;
  @Input() configId: number;
  @Input() eventId: number;
  @Output() finish = new EventEmitter();

  col: number;
  line: number;
  bgColor: string;
  fgColor: string;

  toggle = false;

  constructor(private backend: BackendService, public route: ActivatedRoute) {
  }

  changeToggle() {
    this.toggle = !this.toggle;
  }

  addProduct() {
    this.backend.addProductToPosConfiguration(this.eventId, this.configId, this.item, this.line, this.col, this.bgColor, this.fgColor).subscribe(res => this.finish.emit());
  }

}
