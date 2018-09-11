import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {ScanConfiguration} from '../../types/scan_configuration';

@Component({
  selector: 'app-scan-select',
  templateUrl: './scan-select.component.html'
})
export class ScanSelectComponent implements OnInit {
  loading = true;
  error = false;
  list: ScanConfiguration[];

  constructor(public backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.getScanningConfigurations().subscribe(data => {
        this.list = data;
        this.loading = false;
      }, err => {
        this.loading = false;
        this.error = true;
      });
  }

}
