import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  firstChild: string;

  @Input() menu: MenuItem[];
  @Output() childChange = new EventEmitter<ActivatedRouteSnapshot>();
  @Output() childDestroy = new EventEmitter();


  constructor(protected router: Router, protected route: ActivatedRoute) {
    this.menu = [];
  }

  getActive(tag: string) {
    if (this.isActive(tag)) {
      return 'nav-link active';
    } else {
      return 'nav-link';
    }
  }

  isActive(tag: string) {
    return this.firstChild === tag;
  }

  protected parseChild(path: ActivatedRouteSnapshot) {
    this.firstChild = (path.data && path.data.tag) ? path.data.tag : undefined;

    this.childChange.emit(path);
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
      this.noFirstChild();
    }
  }

  protected noFirstChild() {
    this.firstChild = undefined;
    this.childDestroy.emit();
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
