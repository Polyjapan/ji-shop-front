import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {PosConfiguration} from '../../types/pos_configuration';

@Component({
  selector: 'app-pos-select',
  templateUrl: './pos-select.component.html'
})
export class PosSelectComponent implements OnInit {
  loading = true;
  error = false;
  list: PosConfiguration[];

  constructor(public backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.getPosConfigurations().subscribe(data => {
        this.list = data;
        this.loading = false;
      }, err => {
        this.loading = false;
        this.error = true;
      });
  }

}
