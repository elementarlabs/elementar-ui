import {
  booleanAttribute,
  DestroyRef,
  Directive, ElementRef, EventEmitter,
  inject, Injector, input,
  numberAttribute, OnDestroy, OnInit, output, signal,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy, FlexibleConnectedPositionStrategyOrigin,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { fromEvent, takeUntil } from 'rxjs';
import { Directionality } from '@angular/cdk/bidi';
import { TemplatePortal } from '@angular/cdk/portal';
import { _getEventTarget } from '@angular/cdk/platform';
import { PopoverTrigger, PopoverPosition, POPOVER_TRIGGER } from './types';
import { PositionManager } from '@elementar-ui/components/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[emrPopoverTriggerFor]',
  exportAs: 'emrPopoverTriggerFor',
  host: {
    'class': 'emr-popover-trigger-for',
    '[class.emr-popover-trigger-for--is-open]': 'api.isOpen()',
    '(mousedown)': '_handleClick()',
    '(mouseenter)': '_handleMouseover()',
    '(mouseleave)': '_handleMouseout()'
  }
})
export class PopoverTriggerForDirective implements OnInit, OnDestroy {
  private _overlay = inject(Overlay);
  private _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private _directionality = inject(Directionality, { optional: true });
  private _viewContainerRef = inject(ViewContainerRef);
  private _injector = inject(Injector);
  private _popoverPortal!: TemplatePortal;
  private _overlayRef: OverlayRef | null = null;
  private _destroyRef = inject(DestroyRef);
  private _openTimeout: any = null;
  private _closeTimeout: any = null;
  private _closeDelay = 500;

  popoverTemplateRef = input.required<TemplateRef<unknown>>({
    alias: 'emrPopoverTriggerFor'
  });
  trigger = input<PopoverTrigger>('click');
  position = input<PopoverPosition>('below-center');
  delay = input(500, {
    transform: numberAttribute
  });
  origin = input<FlexibleConnectedPositionStrategyOrigin>();
  closeOnOriginClick = input(false, {
    transform: booleanAttribute
  });
  closeOnOriginMouseLeave = input(false, {
    transform: booleanAttribute
  });
  hideOnScroll = input(false, {
    transform: booleanAttribute
  });
  withLockedPosition = input(false, {
    transform: booleanAttribute
  });

  readonly opened = output<void>();
  readonly closed = output<void>();

  private _closed = new EventEmitter<void>();

  constructor() {
    this._setType();
  }

  protected _handleClick() {
    if (this.trigger() !== 'click') {
      if (this.closeOnOriginClick()) {
        this._close();
      }

      return;
    }

    !this._isOpen() ? this._open() : this._close();
  }

  protected _handleMouseover() {
    if (!this._isOpen() && this.trigger() === 'hover') {
      this._openTimeout = setTimeout(() => {
        this._open();
      }, this.delay());
    }
  }

  protected _handleMouseout() {
    if (!this._isOpen()) {
      clearTimeout(this._openTimeout);
    } else {
      if (this.closeOnOriginMouseLeave()) {
        this._close();
        return;
      }
    }
  }

  ngOnInit() {
    this.closed
      .subscribe(() => {
        this._closed.emit();
      });
  }

  ngOnDestroy() {
    this._close();
    this._destroyOverlay();
  }

  get api() {
    return {
      isOpen: () => this._isOpen(),
      open: () => this._open(),
      close: () => this._close(),
    };
  }

  private _isOpen() {
    return !!this._overlayRef?.hasAttached();
  }

  private _open() {
    if (!this._isOpen() && this.popoverTemplateRef != null) {
      this.opened.emit();
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
      this._overlayRef.attach(this._getPopoverContentPortal());
      this._subscribeToHostMouseleave();
      this._subscribeToOutsideClicks();
    }
  }

  private _close() {
    clearTimeout(this._closeTimeout);
    clearTimeout(this._openTimeout);
    this.closed.emit();
    this._overlayRef!?.detach();
  }

  private _destroyOverlay() {
    clearTimeout(this._openTimeout);
    clearTimeout(this._closeTimeout);
    this._overlayRef?.dispose();
    this._overlayRef = null;
  }

  private _subscribeToOutsideClicks() {
    if (this._overlayRef) {
      this._overlayRef
        .outsidePointerEvents()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(event => {
          const target = _getEventTarget(event) as Element;
          const element = this._elementRef.nativeElement;

          if (this.closeOnOriginClick() && ((target === element) || element.contains(target))) {
            this._close();
            return;
          }

          if (target !== element && !element.contains(target)) {
            this._close();
          }
        });
    }
  }

  private _getPopoverContentPortal() {
    const injector = Injector.create({
      providers: [
        {
          provide: POPOVER_TRIGGER,
          useValue: this
        }
      ],
      parent: this._injector
    });
    this._popoverPortal = new TemplatePortal(
      this.popoverTemplateRef(),
      this._viewContainerRef,
      null,
      injector
    );
    return this._popoverPortal;
  }

  private _getOverlayConfig() {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this.hideOnScroll() ?
        this._overlay.scrollStrategies.close() :
        this._overlay.scrollStrategies.reposition(),
      direction: this._directionality || undefined
    });
  }

  private _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
    const origin = (this.origin() ? this.origin() : this._elementRef) as FlexibleConnectedPositionStrategyOrigin;
    return this._overlay
      .position()
      .flexibleConnectedTo(origin)
      .setOrigin(origin)
      .withGrowAfterOpen()
      .withPositions(this._getOverlayPositions())
      .withLockedPosition(this.withLockedPosition());
  }

  private _getOverlayPositions(): ConnectedPosition[] {
    return (new PositionManager()).build(this.position());
  }

  private _setType() {
    if (this.trigger() === 'hover') {
      return;
    }

    const element = this._elementRef.nativeElement;

    if (element.nodeName === 'BUTTON' && !element.getAttribute('type')) {
      // Prevents form submissions.
      element.setAttribute('type', 'button');
    }
  }

  private _subscribeToHostMouseleave() {
    if (this.trigger() === 'hover' && this._overlayRef) {
      fromEvent(this._elementRef.nativeElement, 'mouseleave')
        .pipe(
          takeUntil(this._closed),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe(event => {
          if (this.closeOnOriginMouseLeave()) {
            this._close();
            return;
          }

          this._closeTimeout = setTimeout(() => {
            this._close();
          }, this._closeDelay);
        })
      ;
      const popoverElement = this._overlayRef.overlayElement;
      fromEvent(popoverElement, 'mouseenter')
        .pipe(
          takeUntil(this._closed),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe(event => {
          clearTimeout(this._closeTimeout);
          this._closeTimeout = null;
        })
      ;
      fromEvent(popoverElement, 'mouseleave')
        .pipe(
          takeUntil(this._closed),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe(event => {
          this._closeTimeout = setTimeout(() => {
            this._close();
          }, this._closeDelay);
        })
      ;
    }
  }
}
