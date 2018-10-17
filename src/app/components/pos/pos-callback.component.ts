import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {PosConfigItem} from '../../types/items';
import {CartService} from '../cart/cart.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {SumupService} from './sumup.service';
import {environment} from '../../../environments/environment';
import {isNullOrUndefined} from 'util';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-pos-callback',
  templateUrl: './pos-callback.component.html'
})
export class PosCallbackComponent implements OnInit {
  loading = true;
  accepted = false;
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
      queryParams['smp-receipt-sent'] as boolean,
      queryParams['smp-tx-code'],
      queryParams['smp-failure-cause']
    ).subscribe(accepted => {
      this.accepted = accepted;
      this.loading = false;
    }, err => {
      this.accepted = false;
      this.loading = false;
    });
  }


}
