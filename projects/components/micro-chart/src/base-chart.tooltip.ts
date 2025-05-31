import { TemplatePortal } from '@angular/cdk/portal';
import { inject, Injector, Renderer2, TemplateRef, ViewContainerRef, DOCUMENT } from '@angular/core';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';

import { OverlayPosition, PositionManager } from '@elementar-ui/components/overlay';

export abstract class BaseChartTooltip {
  protected _tooltipOrigin: HTMLElement;
  protected _tooltipPortal!: TemplatePortal;
  protected _overlayRef: OverlayRef;
  protected _renderer = inject(Renderer2);
  protected _overlay = inject(Overlay);
  protected _viewContainerRef = inject(ViewContainerRef);
  protected _injector = inject(Injector);
  protected _document = inject(DOCUMENT);

  abstract getTooltipTemplateRef(): TemplateRef<any> | undefined;
  abstract getTooltipPosition(): OverlayPosition;

  protected _createTooltipOrigin(): void {
    let tooltipOrigin: HTMLElement | null = this._document.querySelector('.emr-mchart-tooltip-origin');

    if (!tooltipOrigin) {
      tooltipOrigin = this._renderer.createElement('div') as HTMLElement;
      tooltipOrigin.classList.add('emr-mchart-tooltip-origin');
      this._renderer.appendChild(this._document.body, tooltipOrigin);
    }

    this._tooltipOrigin = tooltipOrigin;
    this._renderer.setStyle(this._tooltipOrigin, 'width', '10px');
    this._renderer.setStyle(this._tooltipOrigin, 'height', '10px');
    this._renderer.setStyle(this._tooltipOrigin, 'z-index', '-1');
    this._renderer.setStyle(this._tooltipOrigin, 'position', 'fixed');
    this._renderer.setStyle(this._tooltipOrigin, 'opacity', '0');
  }

  protected _showTooltip(data: object): void {
    this._overlayRef?.detach();
    this._overlayRef = this._overlay.create(this._getOverlayConfig());
    this._overlayRef.attach(this._getContentPortal(data));
  }

  protected _hideTooltip(): void {
    this._overlayRef?.detach();
  }

  protected _setTooltipPositionByEvent(e: MouseEvent): void {
    this._renderer.setStyle(this._tooltipOrigin, 'left', (e.clientX + 10) + 'px');
    this._renderer.setStyle(this._tooltipOrigin, 'top', (e.clientY - 4) + 'px');
  }

  protected _setTooltipVisible(): void {
    this._renderer.addClass(this._tooltipOrigin, 'is-visible');
  }

  protected _setTooltipInVisible(): void {
    this._renderer.removeClass(this._tooltipOrigin, 'is-visible');
  }

  protected _getContentPortal(data: object) {
    this._tooltipPortal = new TemplatePortal(
      this.getTooltipTemplateRef() as TemplateRef<any>,
      this._viewContainerRef,
      {
        '$implicit': {
          ...data
        }
      },
      this._injector
    );

    return this._tooltipPortal;
  }

  protected _getOverlayConfig() {
    return new OverlayConfig({
      panelClass: 'emr-mchart-tooltip-overlay',
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this._overlay.scrollStrategies.reposition()
    });
  }

  protected _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._tooltipOrigin)
      .withFlexibleDimensions()
      .withGrowAfterOpen()
      .withPositions(this._getOverlayPositions())
      ;
  }

  protected _getOverlayPositions(): ConnectedPosition[] {
    return (new PositionManager()).build(this.getTooltipPosition());
  }
}
