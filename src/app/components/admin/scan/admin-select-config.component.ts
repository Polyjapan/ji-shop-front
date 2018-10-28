import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {Event} from '../../../types/event';
import {ScanConfiguration} from '../../../types/scan_configuration';

@Component({
  selector: 'app-admin-select-config',
  templateUrl: './admin-select-config.component.html'
})
export class AdminSelectConfigComponent implements OnInit {
  configs: ScanConfiguration[];

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.backend.getScanningConfigurations().subscribe(configs => this.configs = configs);
  }
}
