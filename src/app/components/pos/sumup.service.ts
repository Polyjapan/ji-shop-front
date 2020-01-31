
import {of as observableOf, Observable} from 'rxjs';

import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {BackendService} from '../../services/backend.service';
import {PaymentMethod, PosPaymentLog} from '../../types/pos_configuration';

@Injectable()
export class SumupService {
  private static KEY = '_sumUpData';
  currentTransaction: number;

  private save() {
    if (isNullOrUndefined(this.currentTransaction)) {
      localStorage.removeItem(SumupService.KEY);
    } else {
      localStorage.setItem(SumupService.KEY, JSON.stringify(this.currentTransaction));
    }
  }

  private load() {
    if (localStorage.getItem(SumupService.KEY)) {
      this.currentTransaction = JSON.parse(localStorage.getItem(SumupService.KEY)) as number;
    }
  }

  constructor(private backend: BackendService) {
    this.load();
  }

  public startPayment(orderId: number) {
    this.currentTransaction = orderId;
    this.save();
    this.backend.sendPosLog(this.currentTransaction, {
      paymentMethod: PaymentMethod.Card,
      accepted: false,
      cardTransactionMessage: 'Card transaction start.',
    }).subscribe(() => {});
  }

  public abortTransaction() {
    this.currentTransaction = undefined;
    this.save();
  }

  public paymentCallback(status: string, message: string, receipt: string, transactionCode: string,
                         failureCode?: string): Observable<CallbackReturn> {

    if (isNullOrUndefined(this.currentTransaction)) {
      return observableOf(CallbackReturn.NO_TRANSACTION);
    }

    const log: PosPaymentLog = {
      paymentMethod: PaymentMethod.Card,
      accepted: status === 'success',
      cardTransactionCode: transactionCode,
      cardTransactionFailureCause: failureCode,
      cardTransactionMessage: message,
      cardReceiptSend: receipt === 'true'
    };

    return this.backend.sendPosLog(this.currentTransaction, log).pipe(map(value => {
      this.currentTransaction = undefined;
      this.save();

      return value.success ? CallbackReturn.SUCCESS : CallbackReturn.ERROR;
    }));
  }
}

export enum CallbackReturn {
  NO_TRANSACTION, SUCCESS, ERROR
}
