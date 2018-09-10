import {ApiResult} from './api_result';
import {Item} from './items';

export class ScanResult extends ApiResult {
  /**
   * A map of the products in the order (key: the product, value: the amount in the order)
   * Only present for multiple items barcodes
   */
  products?: [[Item, number]]; // Only for a multi item barcode
  /**
   * The name (first + last) of the user who made the purchase.
   * Only present for multiple items barcodes
   */
  user?: string; // Only for a multi item barcode
  /**
   * The product corresponding to this barcode
   * Only present for ticket barcodes
   */
  product?: Item; // Only for a ticket
}
