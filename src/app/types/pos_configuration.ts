import {PosConfigItem} from './items';
import {Event} from './event';
import {ScanConfiguration} from './scan_configuration';

export class PosConfiguration {
  id: number;
  eventId: number;
  name: string;
  acceptCards: boolean;
  acceptCamipro: boolean;
}

export class PosGetConfigResponse {
  config: PosConfiguration;
  items: PosConfigItem[];
}

export class PosConfigurationList {
  event: Event;
  configs: PosConfiguration[];
}


export class PosOrderResponse {
  orderId: number;
  price: number;
}

export enum PaymentMethod {
  Cash = 'CASH', Card = 'CARD', Camipro = 'CAMIPRO'
}

export class PosPaymentLog {
  paymentMethod: PaymentMethod;
  accepted: boolean;
  cardTransactionCode?: string;
  cardTransactionFailureCause?: string;
  cardReceiptSend?: boolean;
  cardTransactionMessage?: string;

  logDate?: number;
  orderId?: number;
}
