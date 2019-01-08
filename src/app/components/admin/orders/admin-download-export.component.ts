import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import * as Errors from '../../../constants/errors';
import {ErrorCodes} from '../../../constants/errors';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Source} from '../../../types/order';

@Component({
  selector: 'app-admin-export',
  templateUrl: './admin-download-export.component.html'
})
export class AdminDownloadExportComponent implements OnInit {
  private id: number;
  errors = null;

  source: Source;
  csvLoading = false;
  csvUrl: SafeUrl;

  fnacDay: string;
  fnacMonth: string;
  fnacYear: string;
  fnacLoading = false;
  fnacUrl: SafeUrl;

  Source = Source;

  getText(source: Source) {
    switch (source) {
      case Source.Gift:
        return 'Cadeau';
      case Source.OnSite:
        return 'Sur Place';
      case Source.Physical:
        return 'Vente physique anticipée';
      case Source.Reseller:
        return 'Vente par revendeur';
      case Source.Web:
        return 'Vente par le site';
    }
  }

  constructor(private backend: BackendService, private route: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.parent.paramMap.get('event'));
  }

  getCsvUrl() {
    this.csvLoading = true;
    this.csvUrl = undefined;
    this.errors = null;

    console.log(this.source);

    this.backend.getOrderStats(this.id, undefined, undefined, this.source).subscribe(result => {
      const blob = new Blob([ result ], { type : 'text/csv' });
      console.log(blob);
      this.csvUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
      this.csvLoading = false;
    }, err => {
      console.log(err);
      this.errors = Errors.replaceErrorsInResponse(err, new Map<string, string>());
      this.csvLoading = false;
    });
  }

  getFnacUrl() {
    this.fnacLoading = true;
    this.fnacUrl = undefined;
    this.errors = null;

    this.backend.fnacExport(this.id, this.fnacYear + this.fnacMonth + this.fnacDay).subscribe(result => {
      const blob = new Blob([ result ], { type : 'text/csv' });
      console.log(blob);
      this.fnacUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
      this.fnacLoading = false;
    }, err => {
      this.errors = Errors.replaceErrorsInResponse(err, new Map<string, string>());
      this.fnacLoading = false;
    });
  }
}
