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
import {DomSanitizer, Meta, SafeUrl} from '@angular/platform-browser';
import {PaymentMethod, PosConfiguration} from '../../types/pos_configuration';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html'
})
export class PosComponent implements OnInit {
  items: PosConfigItem[][];
  config: PosConfiguration;
  loading = true;
  configId: number;

  // Processing checkout
  checkoutPrice: number;
  checkoutOrderId: number;
  checkoutErrors: string[];


  givenAmount: number;

  constructor(public backend: BackendService, private auth: AuthService, private cart: CartService,
              private route: ActivatedRoute, private modalService: NgbModal, private sumUp: SumupService,
              private sanitizer: DomSanitizer, private meta: Meta) {
  }

  get change(): number {
    return this.givenAmount - this.checkoutPrice;
  }

  private resetComponent(): void {
    this.cart.clear();

    this.checkoutPrice = undefined;
    this.givenAmount = undefined;
    this.checkoutOrderId = undefined;
    this.checkoutErrors = undefined;
  }

  private buildRows(itemsArray: PosConfigItem[]): PosConfigItem[][] {
    let maxRow = 0;
    let maxCol = 0;

    for (const item of itemsArray) {
      if (item.row > maxRow) {
        maxRow = item.row;
      }
      if (item.col > maxCol) {
        maxCol = item.col;
      }
    }

    const items: PosConfigItem[][] = [];
    for (let row = 0; row <= maxRow; row++) {
      items.push([]);
      for (let col = 0; col <= maxCol; col++) {
        items[row].push(null);
      }
    }

    console.log(items);

    for (const item of itemsArray) {
      items[item.row][item.col] = item;
    }

    console.log(items);

    return items;
  }

  addItem(i: PosConfigItem): void {
    console.log(i);

    this.cart.addItem(i.item);
  }

  ngOnInit(): void {
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' });

    const params = this.route.snapshot.paramMap;

    const queryParams = this.route.snapshot.queryParams;

    if (isNullOrUndefined(queryParams.noClear) || queryParams.noClear === false) {
      this.resetComponent(); // just in case
      console.log('Resetting component');
    }

    this.configId = parseInt(params.get('configId'), 10) as number;

    this.backend.getPosConfiguration(this.configId).subscribe(data => {
      this.items = this.buildRows(data.items);
      this.config = data.config;
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  getItemClasses(item: PosConfigItem): string {
    return ['pos-item', item.color, item.fontColor].join(' ');
  }

  paymentFinished(modal): void {
    // Open the "payment ok" modal
    this.modalService.dismissAll();
    this.backend.sendPosLog(this.checkoutOrderId, {
      paymentMethod: PaymentMethod.Cash,
      accepted: true,
      cardTransactionMessage: 'Cash transaction success.'
    }).subscribe(() => {});
    this.modalService.open(modal, {size: 'lg'}).result.then(() => {
      this.resetComponent();
    }, () => {
      this.resetComponent();
    });
  }

  openModal(modal) {
    this.modalService.dismissAll();
    this.modalService.open(modal, {size: 'lg'});
  }

  cancelCardPayment(modal) {
    this.sumUp.abortTransaction();
    this.modalService.dismissAll();

    if (modal) {
      this.openModal(modal);
    }
  }

  payByCard(cardModal): void {
    this.pay((that)=>{
        that.sumUp.startPayment(that.checkoutOrderId);
        that.openModal(cardModal);
        
    });
  }

  payByCash(cashModal, modalError): void {
  this.pay((that)=>{
    if(that.checkoutErrors){
      that.openModal(modalError);
    }else{
      that.backend.sendPosLog(that.checkoutOrderId, {
        paymentMethod: PaymentMethod.Cash,
        accepted: false,
        cardTransactionMessage: 'Cash payment start.',
      }).subscribe(() => {});
      that.openModal(cashModal);

    }
      });
    }

  pay(cb): void {
    const order = this.cart.getOrder();

    this.backend.placePosOrder(order).subscribe(response => {
      this.checkoutPrice = response.price;
      this.checkoutOrderId = response.orderId;

      console.log(this.checkoutPrice + " / " + this.checkoutOrderId);

      callback();

      // Open the "payment method" modal
      cb(this);
      //this.openModal(modalSuccess);
    }, err => {
      this.checkoutErrors = Errors.replaceErrorsInResponse(err, new Map<string, string>([
        [ErrorCodes.OUT_OF_STOCK, 'Certains produits de votre commande ne sont plus disponibles.'],
        [ErrorCodes.MISSING_ITEM, 'Certains produits de votre commande n\'existent pas.'],
        [ErrorCodes.NO_REQUESTED_ITEM, 'Votre commande est vide.'],
      ]));
      cb(this)
      //this.openModal(modalError);
    });

  }

  sumUpURL(receiptEmail: HTMLInputElement, receiptPhone: HTMLInputElement): SafeUrl {
    if (this.configId === undefined) {
      return null;
    }

    const baseUrl = environment.baseUrl;

    let url = 'sumupmerchant://pay/1.0?' +
      'affiliate-key=' + environment.sumUpKey +
      '&app-id=' + environment.sumUpApp +
      '&total=' + this.checkoutPrice +
      '&amount=' + this.checkoutPrice +
      '&currency=CHF' +
      '&title=PolyJapan AGEPoly' +
      '&skipSuccessScreen=true' +
      '&skip-success-screen=true' +
      '&callback=' + baseUrl + '/pos/' + this.configId + '/callback' +
      '&callbackfail=' + baseUrl + '/pos/' + this.configId + '/callback' +
      '&callbacksuccess=' + baseUrl + '/pos/' + this.configId + '/callback';

    if (!isNullOrUndefined(receiptEmail.value) && receiptEmail.value !== '') {
      url += '&receipt-email=' + receiptEmail.value;
    }

    if (!isNullOrUndefined(receiptPhone.value) && receiptPhone.value !== '') {
      url += '&receipt-mobilephone=' + receiptPhone.value;
    }

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
