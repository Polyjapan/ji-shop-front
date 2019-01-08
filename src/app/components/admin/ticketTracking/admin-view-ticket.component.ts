import {Component} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {TicketData} from '../../../types/ticket_data';
import {parseDate} from '../../../utils/time_utils';
import * as Errors from '../../../constants/errors';
import {ErrorCodes} from '../../../constants/errors';

@Component({
  selector: 'app-admin-view-ticket',
  templateUrl: './admin-view-ticket.component.html'
})
export class AdminViewTicketComponent {
  ticketData: TicketData;
  barcode: string;
  errorMessage: string;


  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }


  parseDate(time: number): string {
    return parseDate(time);
  }

  processTicket() {
    this.ticketData = undefined;
    this.errorMessage = undefined;

    this.backend.getTicketData(this.barcode).subscribe(
      rep => this.ticketData = rep,
      err => {
        this.errorMessage = Errors.replaceErrors(err.error.errors, new Map<string, string>([
          [ErrorCodes.NOT_FOUND, '{key} introuvable.']
        ]), new Map<string, string>([
          ['barcode', 'Code barre'],
        ]))[0];
      });
  }
}
