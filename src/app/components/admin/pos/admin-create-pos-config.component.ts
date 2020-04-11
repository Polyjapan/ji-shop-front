import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../../constants/errors';
import {EventService} from '../../../services/event.service';
import {PosConfiguration} from '../../../types/pos_configuration';

@Component({
  selector: 'app-admin-create-pos-config',
  templateUrl: 'admin-create-pos-config.component.html'
})
export class AdminCreatePosConfigComponent implements OnInit {
  config: PosConfiguration;
  sending = false;
  loading = false;
  isNew = true;
  event = undefined;
  eventId = undefined;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private eventService: EventService) {
  }

  submit() {
    console.log(this.config);
    this.backend.createOrUpdatePosConfig(this.eventId, this.config).subscribe(
      res => {
        this.router.navigate(['admin', 'events', this.eventId, 'pos', res]);
      },
      err => {
        const errors = Errors.replaceErrorsInResponse(err, undefined, new Map<string, string>([
          ['name', 'Nom'],
        ]));

        alert('Des erreurs se sont produites durant l\'envoi : ' + errors.join('; '));
        this.sending = false;
      }
    );

    this.sending = true;
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.parent.parent.paramMap.get('event');
    this.route.paramMap.subscribe(map => {
      if (map.has('id')) {
        const configId = map.get('id');
        this.loading = true;

        this.backend.getPosConfiguration(this.eventId, Number(configId)).subscribe(c => {
          this.config = c.config;
          this.isNew = false;
          this.loading = false;
        });
      }
    });

    this.config = new PosConfiguration();
  }
}
