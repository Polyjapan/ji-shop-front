import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BackendService, UploadsApiResponse} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {HttpEventType, HttpResponse, HttpUploadProgressEvent} from '@angular/common/http';
import {Image} from '../../../types/upload';

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

  click(img: {url: string}) {
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
          const res = (httpEvent as HttpResponse<UploadsApiResponse>);
          console.log('Upload success ' + res.body.data.url);
          this.progress = -1;
          field.value = '';
          this.images.push({
            category: this.category,
            size: 0, // we don't care about the size
            url: res.body.data.url
          });
          this.click(res.body.data);
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
