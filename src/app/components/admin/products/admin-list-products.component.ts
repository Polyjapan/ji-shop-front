import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesData, StatsReturn} from '../../../types/stats';
import {Source} from '../../../types/order';
import {Item, ItemList} from '../../../types/items';
import {Event} from '../../../types/event';
import {EventListService} from '../event-list.service';

@Component({
  selector: 'app-admin-list-products',
  templateUrl: './admin-list-products.component.html'
})
export class AdminListProductsComponent implements OnInit {
  items: Item[];
  event: number;

  constructor(private backend: BackendService, private route: ActivatedRoute, private router: Router, private eventsList: EventListService) {
  }

  ngOnInit(): void {
    this.event = Number(this.route.snapshot.parent.parent.paramMap.get('event'));
    this.reload();
  }

  private reload() {
    this.items = undefined;
    this.backend.getProducts(this.event).subscribe(items => {
      this.items = items;
    });
  }

  purge(): void {
    const conf = confirm('Voulez vous vraiment supprimer les produits inutilisés de cet événement ?\nUn produit est inutilisé s\'il n\'est présent dans aucune commande, configuration de scan, ou configuration point de vente.');

    if (conf) {
      this.backend.purgeProducts(this.event).subscribe(res => this.reload(), err => {
        alert('Une erreur s\'est produite.');
        this.reload();
      });
    }
  }

  delete(): void {
    const conf = confirm('Voulez vous vraiment supprimer cet événement ? Il est certes vide, mais c\'est quand même définitif');

    if (conf) {
      this.backend.deleteEvent(this.event).subscribe(res => {
        this.eventsList.invalidate();
        this.router.navigate(['admin']);
      }, err => {
        alert('Une erreur s\'est produite.');
        this.reload();
      });
    }
  }
}
