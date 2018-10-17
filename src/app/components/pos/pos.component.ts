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
  selector: 'app-pos',
  templateUrl: './pos.component.html'
})
export class PosComponent implements OnInit {
  items: PosConfigItem[][];
  loading = true;

  // Processing checkout
  checkoutPrice: number;
  checkoutOrderId: number;
  checkoutErrors: string[];

  givenAmount: number;

  constructor(public backend: BackendService, private auth: AuthService, private cart: CartService,
              private route: ActivatedRoute, private modalService: NgbModal, private sumUp: SumupService,
              private sanitizer: DomSanitizer) {
  }

  get change(): number {
    return this.givenAmount - this.checkoutPrice;
  }

  private resetComponent(): void {
    this.cart.clear();

    this.checkoutPrice = undefined;
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
    for (let col = 0; col <= maxCol; col++) {
      items.push([]);
      for (let row = 0; row <= maxRow; row++) {
        items[col].push(null);
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
    this.resetComponent(); // just in case

    const params = this.route.snapshot.paramMap;
    const configId = parseInt(params.get('configId'), 10);

    this.backend.getPosConfiguration(configId).subscribe(data => {
      this.items = this.buildRows(data.items);
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
    this.modalService.open(modal, {size: 'lg'}).result.then((result2) => {
      this.resetComponent();
    });
  }

  cancelCardPayment() {
    this.sumUp.abortTransaction();
    this.modalService.dismissAll();
  }

  payByCard(cardModal, errorModal): void {
    this.modalService.dismissAll();

    if (this.sumUp.startPayment(this.checkoutOrderId)) {
      this.modalService.open(cardModal, {size: 'lg'}).result.then(() => {
      }, () => this.sumUp.abortTransaction());
    } else {
      this.checkoutErrors = ['Un paiement par carte est déjà en cours. Ceci est un problème étrange.'];
      this.modalService.open(errorModal, {size: 'lg'});
    }
  }

  pay(modalSuccess, modalError): void {
    const order = this.cart.getOrder();

    this.backend.placePosOrder(order).subscribe(response => {
      this.checkoutPrice = response.price;
      this.checkoutOrderId = response.orderId;

      // Open the "payment method" modal
      this.modalService.open(modalSuccess, {size: 'lg'});
    }, err => {
      this.checkoutErrors = Errors.replaceErrors(err.error.errors, new Map<string, string>([
        [ErrorCodes.OUT_OF_STOCK, 'Certains produits de votre commande ne sont plus disponibles.'],
        [ErrorCodes.MISSING_ITEM, 'Certains produits de votre commande n\'existent pas.'],
        [ErrorCodes.NO_REQUESTED_ITEM, 'Votre commande est vide.'],
      ]));

      this.modalService.open(modalError, {size: 'lg'});
    });

  }

  sumUpURL(receiptEmail: HTMLInputElement, receiptPhone: HTMLInputElement): SafeUrl {
    let url = 'sumupmerchant://pay/1.0?' +
      'affiliate-key=' + environment.sumUpKey +
      '&app-id=' + environment.sumUpApp +
      '&total=' + this.checkoutPrice +
      '&currency=CHF' +
      '&title=PolyJapan AGEPoly' +
      '&callback=http://example.com/myapp/mycallback';

    if (!isNullOrUndefined(receiptEmail.value) && receiptEmail.value !== '') {
      url += '&receipt-email=' + receiptEmail.value;
    }

    if (!isNullOrUndefined(receiptPhone.value) && receiptPhone.value !== '') {
      url += '&receipt-mobilephone=' + receiptPhone.value;
    }

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
