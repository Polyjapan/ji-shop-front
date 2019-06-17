import {Component, OnInit} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {NavigationComponent} from '../../abstraction/navigation-component';
import {MenuItem} from '../sidebar/menuitem';
import {EventService} from './event.service';
import {Event} from '../../types/event';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  eventId: number;
  event: Event;
  menu: MenuItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private eventService: EventService) {
    this.menu.push(new MenuItem('.',  'Home', 'home', ''));
    this.menu.push(new MenuItem('users', 'Utilisateurs', 'users'));
    this.menu.push(new MenuItem('tickets', 'Infos sur un billet', 'ticket-alt'));
  }

  parseChild(path: ActivatedRouteSnapshot) {
    if (path.data && path.data.tag === 'events') {
      if (path.firstChild) {
        if (path.firstChild.paramMap.has('event')) {
          this.eventId = Number(path.firstChild.paramMap.get('event'));
          this.event = this.eventService.getNow(this.eventId);
          this.eventService.get(this.eventId).subscribe(e => this.event = e);

          return;
        }
      }
    }

    this.eventId = undefined;
    this.event = undefined;
  }

  noFirstChild(): void {
    this.eventId = undefined;
    this.event = undefined;
  }
}
