import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../../constants/errors';
import {Event} from '../../../types/event';
import {EventService} from '../event.service';
import {Observable} from 'rxjs';
import {HttpEvent, HttpEventType, HttpResponse, HttpSentEvent} from '@angular/common/http';
import {HttpUploadProgressEvent} from '@angular/common/http/src/response';
import {Image} from '../../../types/upload';
import {environment} from '../../../../environments/environment';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-uploads',
  templateUrl: 'admin-uploads.component.html'
})
export class AdminUploadsComponent implements OnInit {
  @Input() category: string;
  @Input() selected: string;
  @Output() selectUrl = new EventEmitter<string>();
  progress = -1;
  images: Image[] = [];
  open = true;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  click(img: Image) {
    this.selectUrl.emit(img.url);
  }

  ngOnInit(): void {
    console.log('ng init ' + this.category);
    this.backend.getUploads(this.category).subscribe(imgs => this.images = imgs);
  }

  handleFileInput(files: FileList, field: HTMLInputElement) {
    this.progress = 0.0;
    field.disabled = true;

    this.backend.uploadFile(this.category, files.item(0)).subscribe(httpEvent => {
      switch (httpEvent.type) {
        case HttpEventType.UploadProgress:
          const p = (httpEvent as HttpUploadProgressEvent);
          this.progress = p.loaded / p.total;
          console.log('Upload progress: ' + p.loaded + '/' + p.total);
          break;

        case HttpEventType.Response:
          const res = (httpEvent as HttpResponse<Image>);
          console.log('Upload success ' + res.body.name + ' ' + res.body.category);
          this.progress = -1;
          field.value = '';
          this.images.push(res.body);
          this.click(res.body);
          field.disabled = false;
          break;
        default:
          console.log('Ignore http event');
          console.log(httpEvent);
      }
    });
  }

  toggle() {
    this.open = !this.open;
  }
}
