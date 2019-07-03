import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {FullOrder} from '../../types/order';
import * as FileSaver from 'file-saver';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';


@Component({
  selector: 'app-order-content',
  templateUrl: './order-content.component.html'
})
export class OrderContentComponent {
  @Input() order: FullOrder;

  constructor(private backend: BackendService) {
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

  downloadInvoice() {
    this.backend.getInvoice(this.order.order.id).subscribe(blob => {
      console.log(blob);

      if (blob) {
        FileSaver.saveAs(blob, 'invoice-' + this.order.order.id + '.pdf');
      }
    }, error => {
      const errors = Errors.replaceErrorsInResponse(error, new Map<string, string>(
        [[ErrorCodes.NOT_FOUND, 'Cette facture n\'existe pas ou ne peut pas être consultée par vous.']]));

      alert('Impossible de télécharger la facture : \n' + errors.join('\n'));
    });
  }

  offTax(paidPrice: number) {
    return (paidPrice / 1.077).toFixed(2);
  }

  tax(paidPrice: number) {
    return (paidPrice * (.077 / 1.077)).toFixed(2);
  }
}
