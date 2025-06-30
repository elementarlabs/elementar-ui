import { Component } from '@angular/core';
import {
  UploadAllowedTypesComponent,
  UploadAreaComponent,
  UploadAreaDropStateDirective,
  UploadAreaIconDirective,
  UploadAreaInvalidStateDirective,
  UploadAreaMainStateDirective,
  UploadContainerComponent,
  UploadFileSelectedEvent,
  UploadMaxFileSizeComponent,
  UploadTriggerDirective
} from '@elementar-ui/components/upload';
import { JsonPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-upload-area-example',
  imports: [
    JsonPipe,
    UploadAreaComponent,
    MatIcon,
    UploadAreaIconDirective,
    UploadTriggerDirective,
    UploadAllowedTypesComponent,
    UploadMaxFileSizeComponent,
    UploadContainerComponent,
    UploadAreaMainStateDirective,
    UploadAreaDropStateDirective,
    UploadAreaInvalidStateDirective
  ],
  templateUrl: './upload-area-example.component.html',
  styleUrl: './upload-area-example.component.scss'
})
export class UploadAreaExampleComponent {
  files: any[] = [];

  onFileSelected(event: UploadFileSelectedEvent): void {
    this.files = event.files.map(rawFile => {
      return {
        name: rawFile.name,
        size: rawFile.size
      }
    });
  }
}
