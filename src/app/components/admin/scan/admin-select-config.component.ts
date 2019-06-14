import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {Event} from '../../../types/event';
import {ScanConfiguration} from '../../../types/scan_configuration';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-admin-select-config',
  templateUrl: './admin-select-config.component.html'
})
export class AdminSelectConfigComponent implements OnInit {
  configs: ScanConfiguration[];

  constructor(private backend: BackendService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.backend.getScanningConfigurations(Number(this.route.snapshot.parent.parent.paramMap.get('event'))).subscribe(configs => this.configs = configs);
  }
}
