import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import * as Errors from '../../../constants/errors';
import {ErrorCodes} from '../../../constants/errors';

@Component({
  selector: 'app-admin-import',
  templateUrl: './admin-upload-import.component.html'
})
export class AdminUploadImportComponent implements OnInit {
  private id: number;
  sending = false;
  success = false;
  errors = null;

  constructor(private backend: BackendService, private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.parent.paramMap.get('event'));
  }

  submit(field: HTMLInputElement) {
    const reader = new FileReader();
    this.sending = true;
    const me = this;

    reader.readAsText(field.files[0]);
    console.log(reader.result);
    reader.onload = function () {
      console.log(reader.result);

      me.backend.importTickets(me.id, reader.result).subscribe(success => {
        me.success = true;
      }, err => {
        me.errors = Errors.replaceErrorsInResponse(err, new Map<string, string>([
          [ErrorCodes.MISSING_FIELDS, 'Certains champs sont manquants dans le fichier CSV.'],
          [ErrorCodes.DATABASE, 'Erreur de base de données. Certains billets sont peut être dupliqués.']
        ]));
      });
    };
  }
}
