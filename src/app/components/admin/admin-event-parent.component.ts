import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
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
         <li *ngIf="!current" class="breadcrumb-item" aria-current="page">{{event.name}}</li>
         <li *ngIf="current" class="breadcrumb-item"><a routerLink=".">{{event.name}}</a></li>
         <li *ngIf="current" class="breadcrumb-item active" aria-current="page">{{current}}</li>
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
  current = null;

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('event'));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        return route.firstChild ? route.firstChild.routeConfig.path : null;
      })).subscribe(path => this.current = path == null ? null : path.charAt(0).toUpperCase() + path.slice(1));

    if (this.route.firstChild) {
      const path = this.route.firstChild.routeConfig.path;
      this.current = path.charAt(0).toUpperCase() + path.slice(1);
    }

    this.eventService.get(id).subscribe(ev => {
      console.log(ev);
      this.event = ev;
    });
  }
}
