import {PosConfigItem} from './items';

export class PosConfiguration {
  id: number;
  name: string;
}

export class PosGetConfigResponse {
  config: PosConfiguration;
  items: PosConfigItem[];
}

export class PosOrderResponse {
  orderId: number;
  price: number;
}

export enum PaymentMethod {
  Cash = 'CASH', Card = 'CARD'
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
