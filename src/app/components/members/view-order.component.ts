import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {ActivatedRoute, Router} from '@angular/router';
import {CartItem, CartService} from '../../services/cart.service';
import {CheckedOutItem, FullOrder, Order, Source} from '../../types/order';
import {Item} from '../../types/items';
import {environment} from '../../../environments/environment';
import * as FileSaver from 'file-saver';



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

    if (this.auth.requiresLogin('/orders/' + id)) {
      this.backend.getOrder(Number(id)).subscribe(order => {
        this.loading = false;

        if (!order.order.paymentConfirmed) {
          this.errors.push('La commande n\'a pas été payée, impossible de l\'afficher.');
        } else {
          this.order = order;
        }
      }, errors => {

      });
    }
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

    });
  }
}
