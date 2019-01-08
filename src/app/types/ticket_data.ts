import {Client} from './client';

export class TicketData {
  orderId: number;
  validation: ValidationStatus;
  ticket: TicketDataTicket;
}

export class ValidationStatus {
  scanned: boolean;
  scannedBy?: Client;
  scannedAt: number;
}

export class TicketDataTicket {
  createdAt: number;
  removed: boolean;
  id: number;
}
