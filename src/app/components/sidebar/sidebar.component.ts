import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {MenuItem} from './menuitem';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
        <app-sidebar-menu [menu]="menu" (childChange)="onChildChange($event)" (childDestroy)="onChildDestroy()"></app-sidebar-menu>

        <ng-content></ng-content>
      </div>
    </nav>


  `,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() menu: MenuItem[];
  @Output() childChange = new EventEmitter<ActivatedRouteSnapshot>();
  @Output() childDestroy = new EventEmitter();


  constructor(protected router: Router, protected route: ActivatedRoute) {
    this.menu = [];
  }

  onChildChange($event) {
    this.childChange.emit($event);
  }

  onChildDestroy() {
    this.childDestroy.emit();
  }
}

