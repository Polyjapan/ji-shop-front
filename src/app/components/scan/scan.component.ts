import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {ApiError} from '../../types/api_result';
import {ScanResult} from '../../types/scan_result';
import {parseDate} from '../../utils/time_utils';

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
  @ViewChild('ticketLine', { static: true }) ticketLine: ElementRef;

  errorType: string;
  errorMessage: string;
  errorData: any;

  resp: ScanResult;

  okAudio: HTMLAudioElement;
  nopeAudio: HTMLAudioElement;

  constructor(public backend: BackendService, private auth: AuthService,
              private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    this.configId = parseInt(params.get('configId'), 10);

    this.okAudio = new Audio();
    this.okAudio.src = '../../../assets/sounds/ok.ogg';
    this.okAudio.load();

    this.nopeAudio = new Audio();
    this.nopeAudio.src = '../../../assets/sounds/nope.ogg';
    this.nopeAudio.load();
  }

  parseDate(time: number): string {
    return parseDate(time);
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
      [ErrorCodes.NOT_FOUND, '{key} introuvable.'],
      [ErrorCodes.PRODUCT_NOT_ALLOWED, 'Billet valide mais non autorisé dans la configuration actuelle. Refusez le billet et orientez le ' +
      'client vers la bonne file. Ne laissez pas rentrer le client.'],
      [ErrorCodes.PRODUCTS_ONLY, 'Billet de goodies non autorisé par cette configuration. Ce billet doit être utilisé sur le stand ' +
      'PolyJapan.'],
      [ErrorCodes.ALREADY_SCANNED, 'Billet déjà scanné.']
    ]), new Map<string, string>([
      ['config', 'Configuration de scan'],
      ['barcode', 'Code barre'],
    ]))[0];

    this.status = Status.REFUSED;
    this.nopeAudio.play();
  }

  processTicket() {
    this.status = Status.SENDING;
    this.backend.scanTicket(this.configId, this.ticketId).subscribe(res => {
        if (res.success) {
          if (res.product) {
            this.status = Status.ACCEPTED_SINGLE;
            this.resp = res;
            this.okAudio.play();
          } else if (res.products && res.user) {
            this.status = Status.ACCEPTED_MULTI;
            this.resp = res;
            this.okAudio.play();
          } else {
            this.status = Status.REFUSED;
            this.errorMessage = 'Erreur inconnue : données incomplètes.';
            this.nopeAudio.play();
          }
        } else {
          this.handleErrors(res.errors);
        }

        this.previousTicketId = this.ticketId;
        this.ticketId = '';
        setTimeout(() => {
          this.ticketLine.nativeElement.focus();
        }, 100);
      },
      err => {
        this.handleErrors(err.error.errors);


        this.previousTicketId = this.ticketId;
        this.ticketId = '';
        setTimeout(() => {
          this.ticketLine.nativeElement.focus();
        }, 100);
      });
  }
}

export enum Status {
  IDLE, SENDING, ACCEPTED_SINGLE, ACCEPTED_MULTI, REFUSED
}
