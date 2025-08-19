import {
  booleanAttribute,
  DestroyRef,
  Directive, ElementRef,
  inject,
  input, output,
  Renderer2
} from '@angular/core';
import { UploadFileSelectedEvent } from './types';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[emrUploadTrigger]',
  exportAs: 'emrUploadTrigger',
  standalone: true,
  host: {
    '(click)': '_handleClick()'
  }
})
export class UploadTriggerDirective {
  private _elementRef = inject(ElementRef);
  protected _renderer = inject(Renderer2);
  protected _destroyRef = inject(DestroyRef);

  accept = input<string>();
  multiple = input(false, {
    transform: booleanAttribute
  });

  readonly fileSelected = output<UploadFileSelectedEvent>();

  _handleClick() {
    const element: HTMLInputElement = this._renderer.createElement('input');
    this._renderer.setAttribute(element, 'type', 'file');
    let accept = this.accept();

    if (!accept) {
      accept = this._elementRef.nativeElement.getAttribute('accept') || '';
    }

    if (accept) {
      this._renderer.setAttribute(element, 'accept', accept);
    }

    if (this.multiple()) {
      this._renderer.setAttribute(element, 'multiple', '');
    }

    fromEvent(element, 'change')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(event => {
        const files: File[] = [];

        if (element.files) {
          for (let i = 0; i < element.files.length; i++) {
            files.push(element.files[i]);
          }
        }

        this.fileSelected.emit({
          multiple: this.multiple(),
          fileList: element.files,
          event,
          files
        });
      })
    ;
    element.click();
  }
}
