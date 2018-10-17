import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {CartService} from '../cart/cart.service';
import {ActivatedRoute} from '@angular/router';
import {CallbackReturn, SumupService} from './sumup.service';

@Component({
  selector: 'app-pos-callback',
  templateUrl: './pos-callback.component.html'
})
export class PosCallbackComponent implements OnInit {
  loading = true;
  accepted = false;
  invalid = false;
  configId: number;

  constructor(public backend: BackendService, private cart: CartService,
              private route: ActivatedRoute, private sumUp: SumupService) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    this.configId = parseInt(params.get('configId'), 10) as number;

    const queryParams = this.route.snapshot.queryParams;
    this.sumUp.paymentCallback(
      queryParams['smp-status'],
      queryParams['smp-message'],
      queryParams['smp-receipt-sent'],
      queryParams['smp-tx-code'],
      queryParams['smp-failure-cause']
    ).subscribe(accepted => {
      if (accepted === CallbackReturn.NO_TRANSACTION) {
        this.invalid = true;
        this.loading = false;
      } else {
        this.accepted = accepted === CallbackReturn.SUCCESS;
        this.loading = false;
      }
    }, err => {
      this.accepted = false;
      this.loading = false;
    });
  }


}
