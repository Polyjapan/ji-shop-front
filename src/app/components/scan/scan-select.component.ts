import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {ScanConfiguration, ScanConfigurationList} from '../../types/scan_configuration';
import {Event} from '../../types/event';

@Component({
  selector: 'app-scan-select',
  templateUrl: './scan-select.component.html'
})
export class ScanSelectComponent implements OnInit {
  loading = true;
  error = false;
  list: ScanConfigurationList[];

  constructor(public backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.getAllScanningConfigurations().subscribe(data => {
        this.list = data;
        this.loading = false;
      }, err => {
        this.loading = false;
        this.error = true;
      });
  }

}
