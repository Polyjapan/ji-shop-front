import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {PosConfiguration} from '../../../types/pos_configuration';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-select-pos-config',
  templateUrl: './admin-select-pos-config.component.html'
})
export class AdminSelectPosConfigComponent implements OnInit {
  configs: PosConfiguration[];

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.backend.getPosConfigurations(Number(this.route.snapshot.parent.parent.paramMap.get('event'))).subscribe(configs => this.configs = configs);
  }
}
