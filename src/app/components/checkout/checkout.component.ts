import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ApiError, ApiResult} from '../../types/api_result';
import {ActivatedRoute} from '@angular/router';
import {CartItem, CartService} from '../../services/cart.service';
import {CheckedOutItem, Source} from '../../types/order';
import {Permissions} from '../../constants/permissions';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs-compat/add/operator/map';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  checkoutErrors: string[] = null;
  checkoutRemoved: CartItem[] = null;
  checkoutUpdated: Map<string, number> = null;
  checkoutLink: string = null;
  done = false;
  orderId: number = null;
  source: Source = Source.Web;

  // Admin sent
  adminSent = false;
  adminSendErrors: string[];
  multiSendLog: string;
  multiSendProgress: number;
  multiSendStart = false;

  constructor(private backend: BackendService, private auth: AuthService, private route: ActivatedRoute, public cart: CartService) {

  }

  wasUpdated(item: CartItem): boolean {
    return this.checkoutUpdated && this.checkoutUpdated.has(item.baseItem.id + '-' + item.price);
  }

  previousAmount(item: CartItem) {
    return this.checkoutUpdated.get(item.baseItem.id + '-' + item.price);
  }

  get isGift(): boolean {
    return this.source === Source.Gift;
  }

  private placeOrder(source: Source) {

    const order = this.cart.getOrder();

    return this.backend.placeOrder(order, source).map(response => {
      // Build a map
      const netMap: Map<string, CheckedOutItem> = new Map<string, CheckedOutItem>();
      for (const item of response.ordered) {
        if (!this.cart.hasCartItem(item.itemId, item.itemPrice)) {
          this.checkoutErrors = ['Une erreur s\'est produite (des éléments ont été ajoutés à votre commande par le serveur)'];
          return;
        }

        netMap.set(item.itemId + '-' + item.itemPrice, item);
      }

      // Compare source array with map
      const removed: CartItem[] = [];
      const updated: Map<string, number> = new Map<string, number>();
      for (const item of order) {
        const key = item.itemId + '-' + item.itemPrice;
        const networkItem = netMap.get(key);

        if (!networkItem) {
          removed.push({price: item.itemPrice, amount: item.itemAmount, baseItem: this.cart.setItemById(item.itemId, item.itemPrice, 0)});
        } else if (networkItem.itemAmount !== item.itemAmount) {
          updated.set(key, item.itemAmount); // store the old amount
          this.cart.setItemById(item.itemId, item.itemPrice, networkItem.itemAmount);
        }
      }

      return {checkoutLink: response.redirect, orderId: response['orderId'], updated: updated, removed: removed};
    });

  }

  ngOnInit(): void {
    let source = Source.Web;
    const params = this.route.snapshot.paramMap;

    if (params.has('ordertype')) {
      const type = params.get('ordertype');
      if (type === 'gift') {
        if (this.auth.hasPermission(Permissions.GIVE_FOR_FREE)) {
          source = Source.Gift; // the server will check the perm
          this.cart.zeroPrices();
        }
      }
    }

    this.placeOrder(source).subscribe(
      result => {
        // Store everything
        if (result.updated.size > 0) {
          this.checkoutUpdated = result.updated;
        }
        if (result.removed.length > 0) {
          this.checkoutRemoved = result.removed;
        }

        this.checkoutLink = result.checkoutLink;
        this.done = true;
        this.orderId = result.orderId;
        this.source = source;
      }, error => {
        this.checkoutErrors = this.parseErrors(error.error.errors);
      });
  }

  sendTo(email: HTMLInputElement) {
    this.done = false;
    this.handle(this.backend.confirmOrder(this.orderId, email.value));
  }

  sendToMe() {
    this.done = false;
    this.handle(this.backend.confirmOrder(this.orderId));
  }

  sendToMultiple(emails: HTMLTextAreaElement) {
    const mails = emails.value.split('\n');
    const toDo = mails.length;

    this.multiSendStart = true;

    this.validateOrder(this.orderId, mails, toDo);
  }

  private validateOrder(orderId: number, remainingItems: string[], todoTotal: number) {
    const email = remainingItems.pop();
    this.backend.confirmOrder(orderId, email).subscribe(
      result => {
        this.multiSendLog = 'Order #' + orderId + ' sent to ' + email + '. Success: ' + result.success + '. Errors: ' +
          this.parseErrors(result.errors).join('; ') + '\n' + this.multiSendLog;

        // Update progress
        this.multiSendProgress = (todoTotal - remainingItems.length) / todoTotal;
        this.createOrder(remainingItems, todoTotal);
      }, error => {
        this.multiSendLog = 'Order #' + orderId + ' sent to ' + email + '. Errors encountered.' +
          this.parseErrors(error.error.errors).join('; ') + '\n' + this.multiSendLog;
        this.multiSendProgress = (todoTotal - remainingItems.length) / todoTotal;
        this.createOrder(remainingItems, todoTotal);
      }
    );
  }

  private createOrder(remainingItems: string[], todoTotal: number) {
    if (remainingItems.length === 0) {
      this.multiSendLog = 'Finished! \n' + this.multiSendLog;
      return;
    }

    this.placeOrder(Source.Gift).subscribe(
      result => {
        // Store everything
        const orderId = result.orderId;
        this.multiSendLog = 'Order #' + orderId + ' created.' + '\n' + this.multiSendLog;

        this.validateOrder(orderId, remainingItems, todoTotal);
      }, error => {
        this.checkoutErrors = this.parseErrors(error.error.errors);

        this.multiSendLog = 'Order creation failed. Cancel.' + this.parseErrors(error.error.errors).join('; ') + '\n' + this.multiSendLog;
      });
  }

  private handle(adminReq: Observable<ApiResult>) {
    adminReq.subscribe(
      result => {
        if (result.success) {
          this.adminSent = true;
        } else {
          this.adminSendErrors = this.parseErrors(result.errors);
        }
      }, err => this.parseErrors(err.error.errors)
    );
  }

  private parseErrors(errors: ApiError[]) {
    return Errors.replaceErrors(errors, new Map<string, string>([
      [ErrorCodes.OUT_OF_STOCK, 'Certains produits de votre commande ne sont plus disponibles.'],
      [ErrorCodes.MISSING_ITEM, 'Certains produits de votre commande n\'existent pas.'],
      [ErrorCodes.NO_REQUESTED_ITEM, 'Votre commande est vide.'],
    ]));
  }
}
