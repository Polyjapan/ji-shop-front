import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {Event} from '../../../types/event';
import {ScanConfiguration} from '../../../types/scan_configuration';
import {PosConfiguration} from '../../../types/pos_configuration';

@Component({
  selector: 'app-admin-select-pos-config',
  templateUrl: './admin-select-pos-config.component.html'
})
export class AdminSelectPosConfigComponent implements OnInit {
  configs: PosConfiguration[];

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.backend.getPosConfigurations().subscribe(configs => this.configs = configs);
  }
}
