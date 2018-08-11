import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApiResult} from '../types/api_result';
import {BackendService} from './backend.service';

@Injectable()
export class ItemsService {

  constructor(private backend: BackendService) {}

  private getItems() {
    this.backend.getItems().then(items => {

    })
  }
}
