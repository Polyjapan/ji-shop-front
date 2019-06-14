import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {PosConfiguration, PosConfigurationList} from '../../types/pos_configuration';

@Component({
  selector: 'app-pos-select',
  templateUrl: './pos-select.component.html'
})
export class PosSelectComponent implements OnInit {
  loading = true;
  error = false;
  list: PosConfigurationList[];

  constructor(public backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.getAllPosConfigurations().subscribe(data => {
        this.list = data;
        this.loading = false;
      }, err => {
        this.loading = false;
        this.error = true;
      });
  }

}
