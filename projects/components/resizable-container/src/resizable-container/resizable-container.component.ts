import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject, input,
  NgZone,
  numberAttribute,
  OnInit,
  Renderer2,
  viewChild,
  DOCUMENT
} from '@angular/core';
import { fromEvent, throttleTime } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'emr-resizable-container',
  exportAs: 'emrResizableContainer',
  templateUrl: './resizable-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './resizable-container.component.scss',
  host: {
    'class': 'emr-resizable-container'
  }
})
export class ResizableContainerComponent implements OnInit {
  private _renderer = inject(Renderer2);
  private _elementRef = inject(ElementRef);
  private _cdr = inject(ChangeDetectorRef);
  private _ngZone = inject(NgZone);
  private _destroyRef = inject(DestroyRef);
  private _document = inject(DOCUMENT);
  private _resizing = false;
  private _maxWidth: number;
  private _clientX: number;

  readonly handlerRef = viewChild.required<ElementRef>('handler');

  minWidth = input(0, {
    transform: numberAttribute
  });

  ngOnInit() {
    this._ngZone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(this.handlerRef().nativeElement, 'mousedown')
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((event: MouseEvent) => {
          this._resizing = true;

          if (!this._maxWidth) {
            this._maxWidth = this._elementRef.nativeElement.getBoundingClientRect().width;
            this._clientX = event.clientX;
          }

          this._cdr.detectChanges();
        })
      ;
      fromEvent<MouseEvent>(this._document, 'mousemove')
        .pipe(
          throttleTime(5),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe((event: MouseEvent) => {
          if (this._resizing) {
            let width = this._maxWidth - (this._clientX - event.clientX);

            if (width <= this.minWidth()) {
              width = this.minWidth();
            } else if (width >= this._maxWidth) {
              width = this._maxWidth;
            }

            this._renderer.setStyle(this._elementRef.nativeElement, 'width', width + 'px');
          }
        })
      ;
      fromEvent(this._document, 'mouseup')
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(event => {
          this._resizing = false;
          this._cdr.detectChanges();
        })
      ;
    });
  }
}
