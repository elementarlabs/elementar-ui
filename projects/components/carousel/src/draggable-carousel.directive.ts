import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  NgZone,
  AfterContentInit,
  signal,
  input,
  inject,
  output
} from '@angular/core';

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

@Directive({
  selector: '[emrDraggableCarousel]',
  standalone: true,
  host: {
    '(scroll)': 'onScroll($event)',
    '(mousedown)': 'onMouseDown($event)',
    '(mouseleave)': 'onMouseLeaveElement($event)',
    '(document:mousemove)': 'onMouseMove($event)',
    '(document:mouseup)': 'onMouseUpOrLeave($event)',
    '(document:mouseleave)': 'onMouseUpOrLeave($event)',
    '[class.dragging-active]': 'isDragging()'
  }
})
export class DraggableCarouselDirective implements OnInit, AfterContentInit, OnDestroy {
  cardSelector = input<string>('.emr-carousel-card');
  snapToCenter = input<boolean>(true);
  snapDebounceTime = input<number>(50);
  snapDuration = input<number>(300);
  resistanceFactor = input<number>(0.5);
  velocityThreshold = input<number>(0.5);
  visibilityDebounceTime = input<number>(100);

  indexChange = output<number>();

  isDragging = signal(false);
  private startX = signal(0);
  private scrollLeftStart = signal(0);
  private currentTranslateX = signal(0);
  private lastMoveX = signal<number | null>(null);
  private lastMoveTime = signal<number | null>(null);
  private currentVelocityX = signal(0);
  private lastEmittedIndex = signal<number | null>(null);

  private snapTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private scrollAnimationId: number | null = null;
  private transformAnimationId: number | null = null;
  private visibilityDebounceTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private zone = inject(NgZone);

  private hostElement!: HTMLElement;
  private cards: HTMLElement[] = [];

  constructor() {
    // Effect remains the same
  }

  ngOnInit(): void {
    this.hostElement = this.el.nativeElement;
    this.renderer.setStyle(this.hostElement, 'cursor', 'grab');
    this.hostElement.style.scrollBehavior = 'auto';
  }

  ngAfterContentInit(): void { // <<< Renamed from ngAfterViewInit
    this.cards = Array.from(this.hostElement.querySelectorAll<HTMLElement>(this.cardSelector()));

    // Initial state calculation after content is initialized and layout is stable
    setTimeout(() => {
      const actualInitialIndex = this.findCurrentCenterIndex();
      this.emitActiveIndex(actualInitialIndex);
      this.updateCardVisibilityClasses();
    }, 0);
  }

  ngOnDestroy(): void {
    this.clearSnapTimeout();
    this.cancelScrollAnimation();
    this.cancelTransformAnimation();
    clearTimeout(this.visibilityDebounceTimeoutId as any);
  }

  onScroll(event: Event): void {
    if (this.isDragging() || this.scrollAnimationId !== null || this.transformAnimationId !== null) {
      return;
    }

    if (this.visibilityDebounceTimeoutId !== null) {
      clearTimeout(this.visibilityDebounceTimeoutId);
    }
    this.visibilityDebounceTimeoutId = setTimeout(() => {
      this.updateCardVisibilityClasses();
      const currentIndex = this.findCurrentCenterIndex();
      this.emitActiveIndex(currentIndex);
      this.visibilityDebounceTimeoutId = null;
    }, this.visibilityDebounceTime());
  }

  onMouseDown(event: MouseEvent): void {
    clearTimeout(this.visibilityDebounceTimeoutId as any);
    this.clearSnapTimeout();
    this.cancelScrollAnimation();
    this.cancelTransformAnimation();

    if (this.currentTranslateX() !== 0) {
      this.currentTranslateX.set(0);
      this.renderer.setStyle(this.hostElement, 'transform', '');
    }
    this.hostElement.style.scrollBehavior = 'auto';

    if (event.button !== 0) return;

    this.isDragging.set(true);
    this.startX.set(event.pageX - this.hostElement.offsetLeft);
    this.scrollLeftStart.set(this.hostElement.scrollLeft);

    this.lastMoveX.set(event.pageX);
    this.lastMoveTime.set(event.timeStamp);
    this.currentVelocityX.set(0);

    this.renderer.setStyle(this.hostElement, 'cursor', 'grabbing');
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;
    event.preventDefault();

    const currentX = event.pageX;
    const currentTime = event.timeStamp;
    const lastMoveTime = this.lastMoveTime();
    const lastMoveX = this.lastMoveX();

    if (lastMoveTime !== null && lastMoveX !== null && currentTime > lastMoveTime) {
      const deltaX = currentX - lastMoveX;
      const deltaTime = currentTime - lastMoveTime;
      if (deltaTime > 0) {
        this.currentVelocityX.set(-deltaX / deltaTime);
      }
    }
    this.lastMoveX.set(currentX);
    this.lastMoveTime.set(currentTime);

    const dragDeltaX = currentX - (this.startX() + this.hostElement.offsetLeft);
    const intendedScrollLeft = this.scrollLeftStart() - dragDeltaX;
    const maxScrollLeft = this.hostElement.scrollWidth - this.hostElement.clientWidth;
    let targetScrollLeft = intendedScrollLeft;
    let translateX = 0;

    if (intendedScrollLeft < 0) {
      targetScrollLeft = 0;
      const overpull = -intendedScrollLeft;
      translateX = Math.min(overpull * this.resistanceFactor(), this.hostElement.clientWidth * 0.4);
    } else if (intendedScrollLeft > maxScrollLeft) {
      targetScrollLeft = maxScrollLeft;
      const overpull = intendedScrollLeft - maxScrollLeft;
      translateX = -Math.min(overpull * this.resistanceFactor(), this.hostElement.clientWidth * 0.4);
    }

    if (this.hostElement.scrollLeft !== targetScrollLeft) {
      this.hostElement.scrollLeft = targetScrollLeft;
    }

    if (this.currentTranslateX() !== translateX) {
      this.currentTranslateX.set(translateX);
      if (Math.abs(translateX) > 0.1) {
        this.renderer.setStyle(this.hostElement, 'transform', `translateX(${translateX}px)`);
      } else {
        this.currentTranslateX.set(0);
        this.renderer.setStyle(this.hostElement, 'transform', '');
      }
    }
  }

  onMouseUpOrLeave(event: MouseEvent): void {
    if (!this.isDragging()) return;
    this.stopDragging();
  }

  onMouseLeaveElement(event: MouseEvent): void {
    if (!this.isDragging()) {
      this.renderer.setStyle(this.hostElement, 'cursor', 'grab');
    }
  }

  private stopDragging(): void {
    if (!this.isDragging()) return;

    this.isDragging.set(false);
    this.renderer.setStyle(this.hostElement, 'cursor', 'grab');
    this.clearSnapTimeout();

    const wasPulled = Math.abs(this.currentTranslateX()) > 0.1;

    if (wasPulled) {
      this.snapTimeoutId = setTimeout(() => {
        this.animateTransformReset();
        this.snapTimeoutId = null;
      }, this.snapDebounceTime() / 2);
    } else if (this.snapToCenter()) {
      this.snapTimeoutId = setTimeout(() => {
        this.initiateSnap();
        this.snapTimeoutId = null;
      }, this.snapDebounceTime());
    } else {
      this.updateCardVisibilityClasses();
      const currentIndex = this.findCurrentCenterIndex();
      this.emitActiveIndex(currentIndex);
    }
  }

  private initiateSnap(): void {
    this.cards = Array.from(this.hostElement.querySelectorAll<HTMLElement>(this.cardSelector()));
    if (!this.cards.length) return;

    let targetCardIndex = -1;
    const currentScroll = this.hostElement.scrollLeft;
    const containerCenter = currentScroll + this.hostElement.clientWidth / 2;

    let currentNearestCardIndex = this.findNearestCardIndex(this.cards, containerCenter);
    if (currentNearestCardIndex < 0) return;

    const absVelocity = Math.abs(this.currentVelocityX());
    const threshold = this.velocityThreshold();

    if (absVelocity > threshold) {
      if (this.currentVelocityX() < 0) {
        targetCardIndex = currentNearestCardIndex - 1;
      } else {
        targetCardIndex = currentNearestCardIndex + 1;
      }
      targetCardIndex = Math.max(0, Math.min(targetCardIndex, this.cards.length - 1));
    } else {
      targetCardIndex = currentNearestCardIndex;
    }

    if (targetCardIndex >= 0 && targetCardIndex < this.cards.length) {
      this.scrollToCard(targetCardIndex, false);
    } else {
      this.updateCardVisibilityClasses();
    }
  }

  private scrollToCard(index: number, immediate: boolean = false): void {
    if (index < 0 || index >= this.cards.length) {
      return;
    }
    const targetCard = this.cards[index];
    if (!targetCard) return;

    const container = this.hostElement;
    const containerWidth = container.clientWidth;
    const targetCardLeft = targetCard.offsetLeft;
    const targetCardWidth = targetCard.offsetWidth;
    let targetScrollLeft = targetCardLeft + targetCardWidth / 2 - containerWidth / 2;
    const maxScrollLeft = container.scrollWidth - containerWidth;
    targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

    this.cancelScrollAnimation();

    if (immediate) {
      container.scrollLeft = targetScrollLeft;
      this.updateCardVisibilityClasses();
      this.emitActiveIndex(index);
    } else {
      this.animateScroll(targetScrollLeft);
    }
  }

  private findNearestCardIndex(cards: HTMLElement[], position: number): number {
    let nearestIndex = -1;
    let minDistance = Infinity;
    cards.forEach((card, index) => {
      if (card instanceof HTMLElement) {
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const cardCenter = cardLeft + cardWidth / 2;
        const distance = Math.abs(cardCenter - position);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      }
    });
    return nearestIndex;
  }

  private animateTransformReset(): void {
    this.cancelTransformAnimation();
    const startTranslateX = this.currentTranslateX();
    const distance = 0 - startTranslateX;
    if (Math.abs(distance) < 1) {
      if (startTranslateX !== 0) {
        this.currentTranslateX.set(0);
        this.renderer.setStyle(this.hostElement, 'transform', '');
        const finalIndex = this.findCurrentCenterIndex();
        this.emitActiveIndex(finalIndex);
        this.updateCardVisibilityClasses();
      }
      return;
    }
    const duration = this.snapDuration();
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutQuad(progress);
      const newTranslateX = startTranslateX + distance * easedProgress;
      this.currentTranslateX.set(newTranslateX);
      this.renderer.setStyle(this.hostElement, 'transform', `translateX(${newTranslateX}px)`);
      if (progress < 1) {
        this.transformAnimationId = requestAnimationFrame(step);
      } else {
        this.currentTranslateX.set(0);
        this.renderer.setStyle(this.hostElement, 'transform', '');
        this.transformAnimationId = null;
        const finalIndex = this.findCurrentCenterIndex();
        this.emitActiveIndex(finalIndex);
        this.updateCardVisibilityClasses();
      }
    };
    this.zone.runOutsideAngular(() => {
      this.transformAnimationId = requestAnimationFrame(step);
    });
  }

  private animateScroll(targetScrollLeft: number): void {
    this.cancelScrollAnimation();
    const container = this.hostElement;
    const startScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    if (Math.abs(distance) < 1) {
      const finalIndex = this.findCurrentCenterIndex();
      this.emitActiveIndex(finalIndex);
      this.updateCardVisibilityClasses();
      return;
    }
    const duration = this.snapDuration();
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutQuad(progress);
      container.scrollLeft = startScrollLeft + distance * easedProgress;
      if (progress < 1) {
        this.scrollAnimationId = requestAnimationFrame(step);
      } else {
        container.scrollLeft = targetScrollLeft;
        this.scrollAnimationId = null;
        const finalIndex = this.findCurrentCenterIndex();
        this.emitActiveIndex(finalIndex);
        this.updateCardVisibilityClasses();
      }
    };
    this.zone.runOutsideAngular(() => {
      this.scrollAnimationId = requestAnimationFrame(step);
    });
  }

  private findCurrentCenterIndex(): number {
    this.cards = Array.from(this.hostElement.querySelectorAll<HTMLElement>(this.cardSelector()));
    if (!this.cards.length) return -1;
    const currentScroll = this.hostElement.scrollLeft;
    const containerCenter = currentScroll + this.hostElement.clientWidth / 2;
    return this.findNearestCardIndex(this.cards, containerCenter);
  }

  private emitActiveIndex(index: number): void {
    if (index >= 0 && index !== this.lastEmittedIndex()) {
      this.lastEmittedIndex.set(index);
      this.zone.run(() => {
        this.indexChange.emit(index);
      });
    }
  }

  private updateCardVisibilityClasses(): void {
    this.cards = Array.from(this.hostElement.querySelectorAll<HTMLElement>(this.cardSelector()));
    if (!this.cards.length || !this.hostElement.clientWidth) return;

    const viewportStart = this.hostElement.scrollLeft;
    const viewportWidth = this.hostElement.clientWidth;
    const viewportEnd = viewportStart + viewportWidth;
    const tolerance = 1;

    this.cards.forEach(card => {
      if (card instanceof HTMLElement) {
        const cardStart = card.offsetLeft;
        const cardEnd = cardStart + card.offsetWidth;
        const isSpanned = cardStart >= viewportStart - tolerance && cardEnd <= viewportEnd + tolerance;
        const isInView = cardEnd > viewportStart + tolerance && cardStart < viewportEnd - tolerance;

        if (isSpanned) {
          this.renderer.addClass(card, 'is-spanned');
        } else {
          this.renderer.removeClass(card, 'is-spanned');
        }

        if (isInView) {
          this.renderer.addClass(card, 'is-in-view');
        } else {
          this.renderer.removeClass(card, 'is-in-view');
        }
      }
    });
  }

  private cancelScrollAnimation(): void {
    if (this.scrollAnimationId !== null) {
      cancelAnimationFrame(this.scrollAnimationId);
      this.scrollAnimationId = null;
    }
  }

  private cancelTransformAnimation(): void {
    if (this.transformAnimationId !== null) {
      cancelAnimationFrame(this.transformAnimationId);
      this.transformAnimationId = null;
    }
  }

  private clearSnapTimeout(): void {
    if (this.snapTimeoutId !== null) {
      clearTimeout(this.snapTimeoutId);
      this.snapTimeoutId = null;
    }
  }
}
