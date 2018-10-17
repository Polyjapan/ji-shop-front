import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {BackendService} from '../../services/backend.service';
import {Observable} from 'rxjs/Rx';
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

  public startPayment(orderId: number): boolean {
    if (isNullOrUndefined(this.currentTransaction)) {
      this.currentTransaction = orderId;
      this.save();
      return true;
    }

    return false; // a transaction is already in progress
  }

  public abortTransaction() {
    this.currentTransaction = undefined;
    this.save();
  }

  public paymentCallback(status: string, message: string, receipt: boolean, transactionCode: string,
                         failureCode?: string): Observable<Boolean> {

    if (isNullOrUndefined(this.currentTransaction)) {
      return Observable.of(false);
    }

    const log: PosPaymentLog = {
      paymentMethod: PaymentMethod.Card,
      accepted: status === 'accepted',
      cardTransactionCode: transactionCode,
      cardTransactionFailureCause: failureCode,
      cardTransactionMessage: message,
      cardReceiptSend: receipt
    };

    return this.backend.sendPosLog(this.currentTransaction, log).map(value => {
      if (value.success === true) {
        this.currentTransaction = undefined;
        this.save();
      }

      return value.success;
    });
  }
}
