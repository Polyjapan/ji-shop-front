import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {EventService} from './event.service';

@Component({
  selector: 'app-admin-event-parent',
  template: `
    <ng-container *ngIf="event">
      <h1>Gestion de l'événement <i>{{event.name}}
        <i *ngIf="event.visible" class="fas fa-eye"></i><i *ngIf="!event.visible" class="fas fa-eye-slash"></i></i>
      </h1>

      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="..">Admin</a></li>
          <li *ngIf="!children" class="breadcrumb-item" aria-current="page">{{event.name}}</li>
          <li *ngIf="children" class="breadcrumb-item"><a routerLink=".">{{event.name}}</a></li>

          <li *ngFor="let child of firstChildren" class="breadcrumb-item"><a [routerLink]="getLink(child)">{{childName(child)}}</a></li>
          <li *ngIf="children" class="breadcrumb-item active" aria-current="page">{{childName(lastChild)}}</li>
        </ol>
      </nav>

      <router-outlet></router-outlet>
    </ng-container>

    <ng-container *ngIf="!event">
      <h1>Chargement...</h1>
    </ng-container>
  `
})
export class AdminEventParentComponent implements OnInit {
  event = null;
  children: ActivatedRouteSnapshot[] = null;
  private paths: Map<ActivatedRouteSnapshot, string[]>;

  get lastChild() {
    if (this.children === null) {
      return null;
    }
    return this.children[this.children.length - 1];
  }

  get firstChildren() {
    console.log(this.children);
    if (this.children === null) {
      return [];
    }
    return this.children.slice(0, -1);
  }

  childName(child: ActivatedRouteSnapshot) {
    if (child.data && child.data.name) {
      return child.data.name;
    } else {
      return child.routeConfig.path;
    }
  }

  getLink(child: ActivatedRouteSnapshot) {
    return this.paths.get(child);
  }

  constructor(private eventService: EventService, public route: ActivatedRoute, private router: Router) {
  }

  private buildChildrenArray(parent: ActivatedRouteSnapshot) {
    const children: ActivatedRouteSnapshot[] = [];
    const paths: Map<ActivatedRouteSnapshot, string[]> = new Map();

    let child = parent.firstChild;
    const path = [];

    while (child) {
      if (child.routeConfig.path === '') {
        child = child.firstChild;
        continue;
      }

      children.push(child);
      path.push(child.routeConfig.path);
      paths.set(child, Array.from(path.values()));

      child = child.firstChild;
    }

    console.log(children);

    this.children = children.length === 0 ? null : children;
    this.paths = paths;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('event'));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        return route.snapshot;
      })).subscribe(path => this.buildChildrenArray(path));

    if (this.route.firstChild) {
      this.buildChildrenArray(this.route.snapshot);
    }

    this.eventService.get(id).subscribe(ev => {
      console.log(ev);
      this.event = ev;
    });
  }
}
