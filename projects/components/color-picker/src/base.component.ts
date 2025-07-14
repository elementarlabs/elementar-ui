import { afterNextRender, Directive, ElementRef, inject, DOCUMENT } from '@angular/core';
import { fromEvent, merge, Subject, takeUntil } from 'rxjs';


@Directive()
export abstract class BaseComponent {
  private readonly subscriptions: any[] = [];
  private window: any = { pageXOffset: 0, pageYOffset: 0 };
  private readonly requestAnimationFrame: any;
  private mouseup = new Subject<void>();
  private readonly document = inject(DOCUMENT);
  protected readonly elementRef: ElementRef = inject(ElementRef);

  constructor() {
    this.window = this.document.defaultView;
    this.requestAnimationFrame = this.getRequestAnimationFrame();
    this.addEventListeners();
  }

  public abstract movePointer(coordinates: { x: number; y: number; height: number; width: number; }): void;

  private addEventListeners(): void {
    this.subscriptions.push(
      merge(
        fromEvent(this.elementRef.nativeElement, 'touchstart', { passive: true }),
        fromEvent(this.elementRef.nativeElement, 'mousedown')
      )
      // @ts-ignore
      .subscribe((e: TouchEvent | MouseEvent) => this.onEventChange(e))
    );
  }

  private onEventChange(event: MouseEvent | TouchEvent): void {
    this.calculate(event);

    merge(
      fromEvent(this.document, 'mouseup'),
      fromEvent(this.document, 'touchend')
    )
      .pipe(takeUntil(this.mouseup))
      .subscribe(() => this.mouseup.next());

    merge(
      fromEvent(this.document, 'mousemove'),
      fromEvent(this.document, 'touchmove', { passive: true })
    )
      .pipe(takeUntil(this.mouseup))
      // @ts-ignore
      .subscribe((e: MouseEvent | TouchEvent) => this.calculate(e));
  }

  private calculateCoordinates(event: MouseEvent | TouchEvent): void {
    const { width: elWidth, height: elHeight, top: elTop, left: elLeft } = this.elementRef.nativeElement.getBoundingClientRect();
    const pageX = typeof (event as MouseEvent).pageX === 'number'
      ? (event as MouseEvent).pageX : (event as TouchEvent).touches[0].pageX
    ;
    const pageY = typeof  (event as MouseEvent).pageY === 'number'
      ? (event as MouseEvent).pageY : (event as TouchEvent).touches[0].pageY
    ;
    const x = Math.max(0, Math.min(pageX - (elLeft + this.window.pageXOffset), elWidth));
    const y = Math.max(0, Math.min(pageY - (elTop + this.window.pageYOffset), elHeight));
    this.movePointer({ x, y, height: elHeight, width: elWidth });
  }

  private calculate(event: MouseEvent | TouchEvent): void {
    if (!event.type.includes('touch')) {
      // event.preventDefault();
    }

    if (!this.requestAnimationFrame) {
      return this.calculateCoordinates(event);
    }

    // @ts-ignore
    this.requestAnimationFrame(() => this.calculateCoordinates(event));
  }

  private getRequestAnimationFrame(): () => void {
    return this.window.requestAnimationFrame ||
      this.window.webkitRequestAnimationFrame ||
      this.window.mozRequestAnimationFrame ||
      this.window.oRequestAnimationFrame ||
      this.window.msRequestAnimationFrame;
  }

  public ngOnDestroy(): void {
    this.mouseup.next();
    this.mouseup.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }
}
