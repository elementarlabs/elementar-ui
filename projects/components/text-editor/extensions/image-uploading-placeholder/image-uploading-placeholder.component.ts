import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularNodeViewComponent } from '../angular-node-view.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'emr-image-uploading-placeholder',
  exportAs: 'emrTextEditorUploadingPlaceholder',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './image-uploading-placeholder.component.html',
  styleUrl: './image-uploading-placeholder.component.scss',
  host: {
    'class': 'emr-image-uploading-placeholder',
    '[class.selected]': 'selected'
  }
})
export class ImageUploadingPlaceholderComponent extends AngularNodeViewComponent implements OnInit, OnDestroy {
  protected src: string;
  protected error: string;
  private _canceled = false;

  ngOnInit() {
    const uploadFn = this.extension.options['uploadFn'];
    this.src = this.node.attrs['src'];
    const blob = this._dataURItoBlob(this.src);
    uploadFn(blob).then((src: string) => {
      if (this._canceled) {
        return;
      }

      const image = new Image();
      image.src = src;
      image.onload = () => {
        this.editor.chain().focus().setImage({ src }).run();
      };
    }, (error: string) => {
      this.error = error;
    });
  }

  ngOnDestroy() {
    this._canceled = true;
  }

  private _dataURItoBlob(dataURI: string): Blob {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
}
