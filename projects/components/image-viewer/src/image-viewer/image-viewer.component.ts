import { Component, computed, DestroyRef, ElementRef, inject, Renderer2, DOCUMENT } from '@angular/core';
import { IMAGE_VIEWER_PICTURE_DATA, IMAGE_VIEWER_PICTURE_REF } from '../types';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgTemplateOutlet } from '@angular/common';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'emr-image-viewer',
  exportAs: 'emrImageViewer',
  imports: [
    MatIcon,
    MatProgressSpinner,
    NgTemplateOutlet
  ],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
  host: {
    'class': 'emr-image-viewer',
    '[class.loading]': 'loading',
    '[class.dragging]': '_dragging',
    '[class.scaled]': 'scale !== 1'
  }
})
export class ImageViewerComponent {
  readonly elementRef = inject(ElementRef);
  private _document = inject(DOCUMENT);
  private _destroyRef = inject(DestroyRef);
  private _renderer = inject(Renderer2);
  private _startClientY = 0;
  private _startClientX = 0;
  private _offsetY = 0;
  private _offsetX = 0;
  private _tmpOffsetY = 0;
  private _tmpOffsetX = 0;
  protected _dragging = false;
  readonly pictureRef = inject(IMAGE_VIEWER_PICTURE_REF);
  readonly data = inject(IMAGE_VIEWER_PICTURE_DATA);
  loading = true;
  scale = 1;
  image: HTMLImageElement;
  alreadyDragged = false;
  scaleMin = 1;
  scaleMax = 1;
  padding = 30;

  scaled = computed<boolean>(() => {
    return this.scale !== 1;
  });
  hasTitle = computed(() => {
    return !!(this.data.title || this.data.titleTplRef);
  });
  hasAside = computed(() => {
    return !!(this.data.caption || this.data.description || this.data.captionTplRef || this.data.descriptionTplRef);
  });

  onLoad(event: Event): void {
    this.loading = false;
    this.image = (event.target as HTMLImageElement);

    if (this.image.width > this.image.height) {
      this.scaleMax = this.image.naturalWidth / this.image.width;
    } else {
      this.scaleMax = this.image.naturalHeight / this.image.height;
    }

    const image = this.image;
    fromEvent(image, 'mousedown')
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((event: MouseEvent | any) => {
        if (this.scale === this.scaleMin || event.button === 2) {
          return;
        }

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
          const scaleFactor = (1 / this.scale);
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
          const element = this.elementRef.nativeElement as HTMLElement;
          const elementRect = element.getBoundingClientRect();
          this._renderer.removeClass(element, 'dragging');
          this._dragging = false;
          let imageWidth = Math.floor(image.getBoundingClientRect().width);
          let imageHeight = Math.floor(image.getBoundingClientRect().height);
          let imageViewportWidth = this.hasAside() ? elementRect.width - 420 : elementRect.width;
          let imageViewportHeight = elementRect.height;

          if (imageWidth <= imageViewportWidth && imageHeight <= imageViewportHeight) {
            this._tmpOffsetY = 0;
            this._tmpOffsetX = 0;
            this._offsetY = 0;
            this._offsetX = 0;
            this._renderer.setStyle(image, 'transform', `translate(0px,0px)`);
          } else {
            const imageRect = image.getBoundingClientRect();
            const widthDiff = imageViewportWidth - imageWidth;
            const heightDiff = imageViewportHeight - imageHeight;
            const xPositionDiff = widthDiff / this.scale / 2;
            const yPositionDiff = heightDiff / this.scale / 2;

            if (imageRect.x > 0 && imageRect.y > 0) {
              this._tmpOffsetY = yPositionDiff * -1 + this.padding;
              this._tmpOffsetX = xPositionDiff * -1 + this.padding;
            } else if (imageRect.x < widthDiff && imageRect.y > 0) {
              this._tmpOffsetY = yPositionDiff * -1 + this.padding;
              this._tmpOffsetX = xPositionDiff - this.padding;
            } else if (imageRect.x < widthDiff && imageRect.y < heightDiff) {
              this._tmpOffsetY = yPositionDiff - this.padding;
              this._tmpOffsetX = xPositionDiff - this.padding;
            } else if (imageRect.x > 0 && imageRect.y < heightDiff) {
              this._tmpOffsetY = yPositionDiff - this.padding;
              this._tmpOffsetX = xPositionDiff * -1 + this.padding;
            }

            if (imageWidth < imageViewportWidth) {
              this._tmpOffsetX = 0;
            }

            if (imageHeight < imageViewportHeight) {
              this._tmpOffsetY = 0;
            }

            this._offsetY = this._tmpOffsetY;
            this._offsetX = this._tmpOffsetX;
            this._renderer.setStyle(
              image,
              'transform', `translate(${this._tmpOffsetX}px,${this._tmpOffsetY}px)`
            );
          }
        }
      })
    ;
  }

  onBackdropClick(): void {
    this.pictureRef.close();
  }

  onPreventClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  toggleZoom(): void {
    if (this.scale === this.scaleMin) {
      this.scale = this.scaleMax;
    } else {
      this.scale = this.scaleMin;
      this._renderer.setStyle(this.image, 'transform', `translate(0px,0px)`);
      this._offsetX = 0;
      this._offsetY = 0;
      this._tmpOffsetY = 0;
      this._tmpOffsetX = 0;
    }

    const element = this.elementRef.nativeElement as HTMLElement;
    element.style.setProperty('--emr-image-viewer-picture-scale', this.scale.toString());
  }

  protected onDragStart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.alreadyDragged = true;
  }

  private _transform(offsetY: number, offsetX: number): void {
    const image = this.image as HTMLImageElement;
    const scaleFactor = (1 / this.scale);
    let translateX = this._offsetX + offsetX;
    // let offsetStartX = ((image.width / 2) - translateX) / scaleFactor;
    // let offsetEndX = ((image.width / 2) + translateX) / scaleFactor;
    let translateY = this._offsetY + offsetY;
    // let offsetStartY = ((image.height / 2) - translateY) / scaleFactor;
    // let offsetEndY = ((image.height / 2) + translateY) / scaleFactor;

    // let thumbHalfWidth = 150;
    //
    // if (offsetStartX <= thumbHalfWidth && translateX > 0) {
    //   translateX = (image.width / 2) - (thumbHalfWidth * scaleFactor);
    // } else if (offsetEndX <= thumbHalfWidth && translateX < 0) {
    //   translateX = -((image.width / 2) - (thumbHalfWidth * scaleFactor));
    // }
    //
    // if (offsetStartY <= thumbHalfWidth && translateY > 0) {
    //   translateY = (image.height / 2) - (thumbHalfWidth * scaleFactor);
    // } else if (offsetEndY <= thumbHalfWidth && translateY < 0) {
    //   translateY = -((image.height / 2) - (thumbHalfWidth * scaleFactor));
    // }

    this._tmpOffsetY = translateY;
    this._tmpOffsetX = translateX;
    this._renderer.setStyle(
      image,
      'transform', `translate(${translateX}px,${translateY}px)`
    );
  }
}
