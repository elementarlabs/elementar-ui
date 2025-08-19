import {
  booleanAttribute,
  Component,
  inject, input,
  output,
  Renderer2, signal,
} from '@angular/core';
import { UploadFileSelectedEvent } from '../types';

@Component({
  selector: 'emr-upload-area',
  exportAs: 'emrUploadArea',
  templateUrl: './upload-area.component.html',
  styleUrl: './upload-area.component.scss',
  imports: [
  ],
  host: {
    'class': 'emr-upload-area',
    '[class.is-drop-active]': 'isDropActive()',
    '[class.is-drop-invalid]': 'isDropInvalid()',
    '[class.is-allow-hover]': 'allowHover()',
    '(dragover)': 'handleDragOver($event)',
    '(dragenter)': 'handleDragEnter($event)',
    '(dragleave)': 'handleDragLeave($event)',
    '(dragend)': 'handleDragEnd($event)',
    '(drop)': 'handleDrop($event)',
  }
})
export class UploadAreaComponent {
  protected _renderer = inject(Renderer2);

  accept = input<string>();
  allowHover = input(true, {
    transform: booleanAttribute
  });
  multiple = input(false, {
    transform: booleanAttribute
  });

  readonly fileSelected = output<UploadFileSelectedEvent>();
  protected isDropActive = signal(false);
  protected isDropInvalid = signal(false);

  get api() {
    return {
      isDropActive: this.isDropActive()
    }
  }

  protected handleDragOver(event: any) {
    event.preventDefault();
  }

  protected handleDragEnter(event: any) {
    if (event.dataTransfer) {
      const items = event.dataTransfer.items;
      let allFilesAreValid = true;

      if (this.accept()) {
        const accept = (this.accept() as string).split(',');

        if (items && items.length > 0) {
          const draggedItems = Array.from(items);
          allFilesAreValid = draggedItems.every(
            (item: any) => item.kind === 'file' && this.isMimeTypeAllowed(item.type, accept)
          );
        }
      }

      this.isDropActive.set(allFilesAreValid);
      this.isDropInvalid.set(!allFilesAreValid);
    }

    event.preventDefault();
    event.stopPropagation();
  }

  protected handleDragLeave(event: DragEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (!relatedTarget.closest('.emr-upload-area')) {
      this.isDropActive.set(false);
      this.isDropInvalid.set(false);
    }

    event.preventDefault();
  }

  protected handleDragEnd(event: any) {
    this.isDropActive.set(false);
    this.isDropInvalid.set(false);
    event.preventDefault();
  }

  protected handleDrop(event: DragEvent) {
    event.preventDefault();
    this.isDropActive.set(false);
    this.isDropInvalid.set(false);

    if (event.dataTransfer) {
      const accept = (this.accept() as string).split(',');
      const files: File[] = Array.from(event.dataTransfer?.files).filter(file => this.isMimeTypeAllowed(file.type, accept));

      if (files.length === 0) {
        return;
      }

      this.fileSelected.emit({
        multiple: this.multiple(),
        fileList: event.dataTransfer.files,
        event,
        files
      });
    }
  }

  private isMimeTypeAllowed(
    fileMimeType: string,
    allowedMimeTypes: string[]
  ): boolean {
    return allowedMimeTypes.some(allowedType => {
      if (allowedType === '*/*' || allowedType === '*') {
        return true;
      }

      if (allowedType.endsWith('/*')) {
        const baseType = allowedType.slice(0, -2);
        return fileMimeType.startsWith(`${baseType}/`);
      }

      return fileMimeType === allowedType;
    });
  }
}
