import {Component, OnInit} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  firstChild: string;
  menu: MenuItem[];
  eventId: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.menu = [];
    this.menu.push(new MenuItem('.', 'home', 'Home', 'home'));
    this.menu.push(new MenuItem('users', 'users', 'Utilisateurs', 'users'));
    this.menu.push(new MenuItem('scan', 'scan', 'Configurations de scan', 'barcode'));
    this.menu.push(new MenuItem('pos', 'pos', 'Configurations point de vente', 'money-bill'));
  }

  getActive(tag: string) {
    console.log(tag + ' / ' + this.firstChild + ' / ' + this.eventId);

    if (this.isActive(tag)) {
      return 'nav-link active';
    } else {
      return 'nav-link';
    }
  }

  isActive(tag: string) {
    return this.firstChild === tag;
  }

  private parseChild(path: ActivatedRouteSnapshot) {
    this.firstChild = (path.data && path.data.tag) ? path.data.tag : undefined;

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

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        return route.snapshot;
      }),
      filter(route => !isNullOrUndefined(route.firstChild)),
      map((route) => route.firstChild)
    ).subscribe(child => this.parseChild(child));


    if (this.route.firstChild && this.route.snapshot.firstChild.data && this.route.snapshot.firstChild.data.tag) {
      this.parseChild(this.route.snapshot.firstChild);
    } else {
      this.firstChild = undefined;
      this.eventId = undefined;
    }
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
