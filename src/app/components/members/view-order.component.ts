import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {FullOrder} from '../../types/order';
import * as FileSaver from 'file-saver';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';


@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html'
})
export class ViewOrderComponent implements OnInit {
  loading = true;
  errors: string[] = [];
  order: FullOrder;

  constructor(public auth: AuthService, private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.backend.getOrder(Number(id)).subscribe(order => {
      this.loading = false;

      if (!order.order.paymentConfirmed) {
        this.errors.push('La commande n\'a pas été payée, impossible de l\'afficher.');
      } else {
        this.order = order;
      }
    }, errors => {
      this.errors = Errors.replaceErrorsInResponse(error,
        new Map<string, string>([[ErrorCodes.NOT_FOUND, 'Cette commande n\'existe pas.']]));
    });
  }

  get date(): string {
    const date = new Date(this.order.order.createdAt);

    return date.toLocaleString();
  }

  get totalAmount(): number {
    let amt = 0;
    for (const item of this.order.products) {
      amt += item.paidPrice * item.amount;
    }

    return amt;
  }

  downloadTicket(barcode: string) {
    this.backend.getPdf(barcode).subscribe(blob => {
      console.log(blob);

      if (blob) {
        FileSaver.saveAs(blob, 'ticket-' + barcode + '.pdf');
      }
    }, error => {
      const errors = Errors.replaceErrorsInResponse(error, new Map<string, string>(
        [[ErrorCodes.NOT_FOUND, 'Ce billet n\'existe pas ou ne peut pas être consulté par vous.']]));

      alert('Impossible de télécharger le billet : \n' + errors.join('\n'));
    });
  }
}
