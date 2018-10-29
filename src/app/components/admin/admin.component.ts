import {Component, OnInit} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {NavigationComponent} from '../../abstraction/navigation-component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  eventId: number;
  menu: MenuItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.menu.push(new MenuItem('.', 'home', 'Home', 'home'));
    this.menu.push(new MenuItem('users', 'users', 'Utilisateurs', 'users'));
    this.menu.push(new MenuItem('scan', 'scan', 'Configurations de scan', 'barcode'));
    this.menu.push(new MenuItem('pos', 'pos', 'Configurations point de vente', 'money-bill'));
  }

  parseChild(path: ActivatedRouteSnapshot) {
    if (path.data && path.data.tag === 'events') {
      if (path.firstChild) {
        if (path.firstChild.paramMap.has('event')) {
          this.eventId = Number(path.firstChild.paramMap.get('event'));
          return;
        }
      }
    }

    this.eventId = undefined;
  }

  noFirstChild(): void {
    this.eventId = undefined;
  }
}

export class MenuItem {


  constructor(routerLink: string, tag: string, text: string, icon: string) {
    this.routerLink = routerLink;
    this.tag = tag;
    this.text = text;
    this.icon = icon;
  }

  routerLink: string;
  tag: string;
  text: string;
  icon: string;

  get iconClass() {
    return 'feather fas fa-' + this.icon;
  }
}
