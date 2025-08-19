import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute, OnChanges,
  OnInit,
  Renderer2, SimpleChanges,
  DOCUMENT
} from '@angular/core';
import { fromEvent } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[emrDragImage]',
  standalone: true,
  host: {
    '(load)': 'onLoad()'
  }
})
export class DragImageDirective implements OnInit, OnChanges {
  private _elementRef = inject(ElementRef);
  private _document = inject(DOCUMENT);
  private _destroyRef = inject(DestroyRef);
  private _renderer = inject(Renderer2);
  private _dragging = false;
  private _startClientY = 0;
  private _startClientX = 0;
  private _offsetY = 0;
  private _offsetX = 0;
  private _tmpOffsetY = 0;
  private _tmpOffsetX = 0;
  private _imageLoaded = false;

  scale = input.required({
    transform: numberAttribute
  });
  content = input.required<HTMLElement>();

  onLoad(): void {
    this._imageLoaded = true;
  }

  ngOnInit() {
    const image = this._elementRef.nativeElement as HTMLImageElement;
    fromEvent(image, 'mousedown')
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((event: any) => {
        this._dragging = true;
        this._startClientY = event.clientY;
        this._startClientX = event.clientX;
      })
    ;
    fromEvent(this._document, 'mousemove')
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((event: any) => {
        if (this._dragging) {
          const scaleFactor = (1 / this.scale());
          let offsetY = (event.clientY - this._startClientY) * scaleFactor;
          let offsetX = (event.clientX - this._startClientX) * scaleFactor;
          this._transform(offsetY, offsetX);
        }
      })
    ;
    fromEvent(this._document, 'mouseup')
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((event: any) => {
        if (this._dragging) {
          this._dragging = false;
          this._offsetY = this._tmpOffsetY;
          this._offsetX = this._tmpOffsetX;
        }
      })
    ;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['scale'].firstChange) {
      if (!this._imageLoaded) {
        return;
      }

      this._transform(0, 0, );
      this._offsetY = this._tmpOffsetY;
      this._offsetX = this._tmpOffsetX;
    }
  }

  onImageLoad(event: any): void {
    this._imageLoaded = true;
  }

  getDataUrl(): string {
    return this._getCanvas().toDataURL('png', 100);
  }

  toBlob(callback: BlobCallback): void {
    return this.getCanvas().toBlob(callback, 'png', 100);
  }

  getCanvas(): HTMLCanvasElement {
    return this._getCanvas();
  }

  private _getCanvas(): HTMLCanvasElement {
    const image = this._elementRef.nativeElement as HTMLImageElement;
    const canvas = this._document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(
      image,
      -((image.width * this.scale() - 300) / 2) + this._offsetX * this.scale(),
      -((image.height * this.scale() - 300) / 2) + this._offsetY * this.scale(),
      image.width * this.scale(),
      image.height * this.scale()
    );
    return canvas;
  }

  private _transform(offsetY: number, offsetX: number): void {
    const image = this._elementRef.nativeElement as HTMLImageElement;
    const scaleFactor = (1 / this.scale());
    let translateX = this._offsetX + offsetX;
    let offsetStartX = ((image.width / 2) - translateX) / scaleFactor;
    let offsetEndX = ((image.width / 2) + translateX) / scaleFactor;
    let translateY = this._offsetY + offsetY;
    let offsetStartY = ((image.height / 2) - translateY) / scaleFactor;
    let offsetEndY = ((image.height / 2) + translateY) / scaleFactor;
    let thumbHalfWidth = 150;

    if (offsetStartX <= thumbHalfWidth && translateX > 0) {
      translateX = (image.width / 2) - (thumbHalfWidth * scaleFactor);
    } else if (offsetEndX <= thumbHalfWidth && translateX < 0) {
      translateX = -((image.width / 2) - (thumbHalfWidth * scaleFactor));
    }

    if (offsetStartY <= thumbHalfWidth && translateY > 0) {
      translateY = (image.height / 2) - (thumbHalfWidth * scaleFactor);
    } else if (offsetEndY <= thumbHalfWidth && translateY < 0) {
      translateY = -((image.height / 2) - (thumbHalfWidth * scaleFactor));
    }

    this._tmpOffsetY = translateY;
    this._tmpOffsetX = translateX;
    this._renderer.setStyle(
      image,
      'transform', `translate(${translateX}px,${translateY}px)`
    );
  }
}
