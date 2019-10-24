import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Event} from '../../../types/event';
import {MenuItem} from '../../sidebar/menuitem';
import {EventService} from '../event.service';

@Component({
  selector: 'app-admin-event-sidebar',
  template: `
    <ng-container *ngIf="event">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>{{event.name}}</span>
      </h6>

      <app-sidebar-menu [menu]="menu" [depth]="3" [basePath]="['events', id]"></app-sidebar-menu>
    </ng-container>
  `,

  styleUrls: ['./admin-select-edition.component.css']
})
export class AdminEventSidebarComponent implements OnInit {
  @Input() id: number;
  @Input() event: Event;

  menu: MenuItem[] = [];

  constructor(private route: ActivatedRoute, private eventService: EventService) {
    this.menu.push(new MenuItem('stats', 'Statistiques', 'chart-bar'));
    this.menu.push(new MenuItem('entrances', 'Entrées', 'chart-bar'));
    this.menu.push(new MenuItem('update', 'Modifier l\'événement', 'edit'));
    this.menu.push(new MenuItem('products', 'Produits en vente', 'shopping-cart'));
    this.menu.push(new MenuItem('orders', 'Listing de commandes', 'receipt'));
    this.menu.push(new MenuItem('scan', 'Configurations de scan', 'barcode'));
    this.menu.push(new MenuItem('pos', 'Configurations caisse', 'money-bill'));
    this.menu.push(new MenuItem('export', 'Exportation', 'file-export'));
    this.menu.push(new MenuItem('import', 'Import de billets', 'file-import'));
  }

  ngOnInit(): void {
    this.menu.push(new MenuItem(this.id.toString(), 'Cloner', 'plus', undefined, ['events', 'clone']));
  }
}
