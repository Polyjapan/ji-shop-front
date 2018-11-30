import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {SalesData, StatsReturn} from '../../../types/stats';
import {Source} from '../../../types/order';
import * as Errors from '../../../constants/errors';
import {ErrorCodes} from '../../../constants/errors';
import {Event} from '../../../types/event';
import {EventService} from '../event.service';
import {Item} from '../../../types/items';

@Component({
  selector: 'app-admin-create-product',
  templateUrl: 'admin-create-product.component.html'
})
export class AdminCreateProductComponent implements OnInit {
  product: Item;
  sending = false;
  loading = false;
  isNew = true;

  updatedName: string;
  updatedWasNew: boolean;

  eventId: number;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private eventService: EventService) {
  }

  submit(next: string) {
    const name = this.product.name;
    const wasNew = this.isNew;
    this.backend.createOrUpdateProduct(this.eventId, this.product).subscribe(
      res => {

        // noinspection TsLint FallThroughInSwitchStatementJS
        switch (next) {
          case 'list':
            this.router.navigate(['admin', 'events', this.eventId, 'products']);
            break;

          case 'clear':
            this.product = new Item();
            this.product.eventId = this.eventId;
            this.isNew = true;
          case 'stay':
            this.updatedName = name;
            this.updatedWasNew = wasNew;
            this.sending = false;
        }

      },
      err => {
        const errors = Errors.replaceErrorsInResponse(err);

        alert('Des erreurs se sont produites durant l\'envoi : ' + errors.join('; '));
        this.sending = false;
      }
    );

    this.sending = true;
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.parent.parent.snapshot.paramMap.get('event'));

    this.route.paramMap.subscribe(map => {
      if (map.has('productId')) {
        const productId = map.get('productId');
        this.loading = true;

        this.backend.getProduct(this.eventId, Number(productId)).subscribe(it => {
          this.product = it;
          this.isNew = false;
          this.loading = false;
        });
      }
    });

    this.product = new Item();
    this.product.maxItems = -1; // Default max items
    this.product.eventId = this.eventId;
  }
}
