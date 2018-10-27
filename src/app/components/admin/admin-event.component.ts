import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {SalesData, StatsReturn} from '../../types/stats';
import {Source} from '../../types/order';

@Component({
  selector: 'app-admin-event',
  template: `    
    
    
    <p>Que voulez vous faire avec cet événement ?</p>
    <ul>
      <li><a routerLink="stats">Statistiques de l'événement</a></li>
      <li><a routerLink="update">Modifier les paramètres de l'événement</a></li>
      <li><a routerLink="products">Gérer les produits vendus dans l'événement</a></li>
      <li><a routerLink="import">Import de billets FNAC</a></li>
    </ul>
  `
})
export class AdminEventComponent {
 }
