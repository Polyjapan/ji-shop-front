import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList} from '../../types/items';

@Component({
  selector: 'app-item-list-display',
  templateUrl: './item-list-display.component.html'
})
export class ItemListDisplayComponent {
  @Input() items: ItemList[] = null;
}
