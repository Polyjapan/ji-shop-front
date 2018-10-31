import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MenuItem} from './menuitem';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {
  firstChild: string;

  @Input() menu: MenuItem[];
  @Input() depth = 1;
  @Input() basePath = [];
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

  getPath(item: MenuItem) {
    const basePath = item.basePath ? item.basePath : this.basePath;
    const clone = basePath.slice(0);
    clone.push(item.routerLink);
    return clone;
  }

  isActive(tag: string) {
    return this.firstChild === tag;
  }

  protected parseChild(path: ActivatedRouteSnapshot) {
    if (isNullOrUndefined(path)) {
      this.noChild();
      return;
    }

    this.firstChild = path.routeConfig.path;
    console.log('firstChild: "' + this.firstChild + '"');
    this.childChange.emit(path);
  }

  private getChild(basePath: ActivatedRouteSnapshot) {
    let child = basePath;
    let i = 0;

    while (i < this.depth) {
      if (isNullOrUndefined(child)) {
        return child;
      }

      child = child.firstChild;
      ++i;
    }

    return child;
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        return route.snapshot;
      }),
      map((route) => this.getChild(route))
    ).subscribe(child => this.parseChild(child));

    const child = this.getChild(this.route.snapshot);
    this.parseChild(child);
  }

  protected noChild() {
    this.firstChild = undefined;
    this.childDestroy.emit();
  }

}
