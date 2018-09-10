import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {Item, ItemList, ItemsResponse} from '../../types/items';
import {Observable} from 'rxjs/Rx';
import {Permissions} from '../../constants/permissions';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {ApiError} from '../../types/api_result';
import {ScanResult} from '../../types/scan_result';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html'
})
export class ScanComponent implements OnInit {
  Status = Status;
  ErrorCodes = ErrorCodes;

  configId: number;
  ticketId: string; // used in ngModel
  previousTicketId: string;
  status = Status.IDLE;
  @ViewChild('ticketLine') ticketLine: ElementRef;

  errorType: string;
  errorMessage: string;
  errorData: any;

  resp: ScanResult;

  constructor(public backend: BackendService, private auth: AuthService,
              private router: Router, private route: ActivatedRoute) {
  }

  get sending(): boolean {
    return this.status === Status.SENDING;
  }

  ngOnInit(): void {
    if (!this.auth.hasPermission(Permissions.SCAN_TICKET)) {
      console.log('No perm');
      this.router.navigate(['/']);
    } else {
      console.log('Perm');
      const params = this.route.snapshot.paramMap;
      this.configId = parseInt(params.get('configId'), 10);
    }
  }

  parseDate(time: number): string {
    const date = new Date(time);

    return date.toLocaleString();
  }


  private handleErrors(errors: ApiError[]) {
    // There should be only one error
    for (const err of errors) {
      this.errorData = err.args ? err.args[0] : undefined;

      for (const msg of err.messages) {
        this.errorType = msg;
      }
    }

    // Here we extract the error
    this.errorMessage = Errors.replaceErrors(errors, new Map<string, string>([
      [ErrorCodes.NOT_FOUND, '{key} introuvable.' ],
      [ErrorCodes.PRODUCT_NOT_ALLOWED, 'Billet valide mais non autorisé dans la configuration actuelle. Refusez le billet et orientez le ' +
      'client vers la bonne file. Ne laissez pas rentrer le client.' ],
      [ErrorCodes.PRODUCTS_ONLY, 'Billet de goodies non autorisé par cette configuration. Ce billet doit être utilisé sur le stand ' +
      'PolyJapan.' ],
      [ErrorCodes.ALREADY_SCANNED, 'Billet déjà scanné.']
    ]), new Map<string, string>([
      ['config', 'Configuration de scan'],
      ['barcode', 'Code barre'],
    ]))[0];

    this.status = Status.REFUSED;
  }

  processTicket() {
    this.status = Status.SENDING;
    this.backend.scanTicket(this.configId, this.ticketId).subscribe(res => {
        if (res.success) {
          if (res.product) {
            this.status = Status.ACCEPTED_SINGLE;
            this.resp = res;
          } else if (res.products && res.user) {
            this.status = Status.ACCEPTED_MULTI;
            this.resp = res;
          } else {
            this.status = Status.REFUSED;
            this.errorMessage = 'Erreur inconnue : données incomplètes.';
          }
        } else {
          this.handleErrors(res.errors);
        }

        this.previousTicketId = this.ticketId;
        this.ticketId = '';
        setTimeout(() => { this.ticketLine.nativeElement.focus(); }, 100);
      },
      err => {
        this.handleErrors(err.error.errors);


        this.previousTicketId = this.ticketId;
        this.ticketId = '';
        setTimeout(() => { this.ticketLine.nativeElement.focus(); }, 100);
      });
  }
}

export enum Status {
  IDLE, SENDING, ACCEPTED_SINGLE, ACCEPTED_MULTI, REFUSED
}
