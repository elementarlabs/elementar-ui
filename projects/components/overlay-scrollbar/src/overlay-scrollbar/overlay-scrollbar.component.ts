import {
  Component,
  ElementRef,
  NgZone,
  Renderer2,
  inject,
  PLATFORM_ID,
  signal,
  computed,
  effect,
  input,
  DestroyRef,
  untracked,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  fromEvent,
  map,
  takeUntil,
  switchMap,
  tap,
  merge,
  debounceTime,
  distinctUntilChanged,
  Observable,
  finalize,
  filter,
  Subscription
} from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'emr-overlay-scrollbar',
  exportAs: 'emrOverlayScrollbar',
  templateUrl: './overlay-scrollbar.component.html',
  styleUrl: './overlay-scrollbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-overlay-scrollbar',
    '[class.scrollbar-visible]': 'isVisible()',
    '[class.scrollbar-interactive]': 'isInteractive()',
    '[class.is-absolute]': 'absolute()',
  }
})
export class OverlayScrollbarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly scrollableContentRef = viewChild.required<ElementRef<HTMLElement>>('scrollableContent');
  readonly scrollTrackRef = viewChild.required<ElementRef<HTMLElement>>('scrollTrack');
  readonly scrollThumbRef = viewChild.required<ElementRef<HTMLElement>>('scrollThumb');

  readonly scrollbarWidth = input<string>('8px');
  readonly autoHide = input<boolean>(true);
  readonly absolute = input<boolean>(false);

  readonly isDragging = signal(false);
  readonly isHovering = signal(false);
  private readonly scrollTop = signal(0);
  private readonly contentScrollHeight = signal(0);
  private readonly contentClientHeight = signal(0);
  private readonly trackClientHeight = signal(0);
  private readonly showDueToActivity = signal(false);

  readonly hasScroll = computed(() => this.contentScrollHeight() > this.contentClientHeight() + 1);
  readonly scrollRatio = computed(() => this.hasScroll() ? this.contentClientHeight() / this.contentScrollHeight() : 1);

  readonly minThumbHeight = 20;
  readonly thumbHeight = computed(() => {
    if (!this.hasScroll()) return 0;
    const trackHeight = this.trackClientHeight();
    const ratio = this.scrollRatio();
    const calculated = trackHeight * ratio;
    return Math.max(calculated, this.minThumbHeight);
  });
  readonly maxScrollTop = computed(() => Math.max(0, this.contentScrollHeight() - this.contentClientHeight()));
  readonly maxThumbTop = computed(() => Math.max(0, this.trackClientHeight() - this.thumbHeight()));
  readonly thumbTop = computed(() => {
    if (!this.hasScroll()) return 0;
    const maxScroll = this.maxScrollTop();
    const currentScroll = this.scrollTop();
    const maxThumb = this.maxThumbTop();
    return maxScroll > 0 ? (currentScroll / maxScroll) * maxThumb : 0;
  });
  readonly isVisible = computed(() => {
    if (!this.hasScroll()) return false;
    if (!this.autoHide()) return true;
    return this.isHovering() || this.isDragging() || this.showDueToActivity();
  });
  readonly isInteractive = computed(() => this.isHovering() || this.isDragging());

  private isInitialized = signal(false);
  private eventsSubscription: Subscription | null = null;
  private observersSubscription: Subscription | null = null;
  private hideTimeout: any = null;

  constructor() {
    effect(() => {
      this.scrollableContentRef();
      this.scrollTrackRef();
      this.scrollThumbRef();

      if (isPlatformBrowser(this.platformId) && !this.isInitialized()) {
        this.initializeComponentLogic();
        this.isInitialized.set(true);
      }
    });
    this.setupStyleEffects();
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  private initializeComponentLogic(): void {
    this.updateDimensions();
    this.setupObservers();
    this.setupEventStreams();
    this.setupRouteChanges();
  }

  private setupStyleEffects(): void {
    effect(() => {
      const width = this.scrollbarWidth();
      const trackElement = this.scrollTrackRef().nativeElement;
      const thumbElement = this.scrollThumbRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(trackElement, 'width', width);
        this.renderer.setStyle(thumbElement, 'width', width);
      });
    });

    effect(() => {
      const height = this.thumbHeight();
      const thumbElement = this.scrollThumbRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(thumbElement, 'height', `${height}px`);
      });
    });

    effect(() => {
      const top = this.thumbTop();
      const thumbElement = this.scrollThumbRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(thumbElement, 'transform', `translateY(${top}px)`);
      });
    });
  }

  private setupObservers(): void {
    const scrollableElement = this.scrollableContentRef().nativeElement;
    const hostElement = this.elRef.nativeElement;

    const resize$ = new Observable<ResizeObserverEntry[]>(observer => {
      const resizeObserver = new ResizeObserver(entries => this.zone.run(() => observer.next(entries)));
      resizeObserver.observe(scrollableElement);
      resizeObserver.observe(hostElement);
      return () => resizeObserver.disconnect();
    }).pipe(debounceTime(50));

    const mutation$ = new Observable<MutationRecord[]>(observer => {
      const mutationObserver = new MutationObserver(mutations => this.zone.run(() => observer.next(mutations)));
      mutationObserver.observe(scrollableElement, { childList: true, subtree: true, characterData: true });
      return () => mutationObserver.disconnect();
    }).pipe(debounceTime(50));

    this.observersSubscription = merge(resize$, mutation$)
      .subscribe(() => {
        this.zone.run(() => this.updateDimensions());
      });
  }

  private setupEventStreams(): void {
    const scrollableElement = this.scrollableContentRef().nativeElement;
    const hostElement = this.elRef.nativeElement;
    const thumbElement = this.scrollThumbRef().nativeElement;

    const scroll$ = fromEvent(scrollableElement, 'scroll', { passive: true }).pipe(
      tap(() => {
        this.zone.run(() => this.scrollTop.set(scrollableElement.scrollTop));
      }),
      filter(() => this.autoHide()),
      tap(() => this.zone.run(() => this.showDueToActivity.set(true))),
      debounceTime(1500),
      tap(() => {
        untracked(() => {
          if (!this.isHovering() && !this.isDragging()) {
            this.zone.run(() => this.showDueToActivity.set(false));
          }
        })
      })
    );

    const hostEnter$ = fromEvent<MouseEvent>(hostElement, 'mouseenter').pipe(
      tap(() => this.zone.run(() => {
        this.isHovering.set(true);
        if (untracked(this.autoHide)) this.showDueToActivity.set(true);
      }))
    );
    const hostLeave$ = fromEvent<MouseEvent>(hostElement, 'mouseleave').pipe(
      tap(() => this.zone.run(() => {
        this.isHovering.set(false);
        if(untracked(this.autoHide) && !untracked(this.isDragging)){
          this.scheduleHide();
        }
      }))
    );

    const thumbMouseDown$ = fromEvent<MouseEvent>(thumbElement, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

    const thumbDrag$ = thumbMouseDown$.pipe(
      tap(event => {
        event.preventDefault();
        event.stopPropagation();
      }),
      switchMap(startEvent => {
        const startY = startEvent.clientY;
        const startScrollTop = scrollableElement.scrollTop;
        const initialTrackHeight = untracked(() => this.trackClientHeight());
        const initialContentHeight = untracked(() => this.contentScrollHeight());

        this.zone.run(() => this.isDragging.set(true));

        return mouseMove$.pipe(
          map(moveEvent => {
            moveEvent.preventDefault();
            const deltaY = moveEvent.clientY - startY;
            const scrollDelta = initialTrackHeight > 0
              ? (deltaY / initialTrackHeight) * initialContentHeight
              : 0;
            return startScrollTop + scrollDelta;
          }),
          distinctUntilChanged(),
          tap(newScrollTop => {
            this.renderer.setProperty(scrollableElement, 'scrollTop', newScrollTop);
          }),
          takeUntil(mouseUp$),
          finalize(() => {
            this.zone.run(() => {
              this.isDragging.set(false);
              untracked(() => {
                if (this.autoHide() && !this.isHovering()) {
                  this.scheduleHide();
                }
              })
            });
          })
        );
      })
    );

    this.zone.runOutsideAngular(() => {
      this.eventsSubscription = merge(
        scroll$,
        hostEnter$,
        hostLeave$,
        thumbDrag$
      ).subscribe();
    });
  }

  private scheduleHide(): void {
    this.clearHideTimeout();
    this.zone.runOutsideAngular(() => {
      this.hideTimeout = setTimeout(() => {
        untracked(() => {
          if(!this.isHovering() && !this.isDragging()) {
            this.zone.run(() => this.showDueToActivity.set(false));
          }
        });
        this.hideTimeout = null;
      }, 100);
    });
  }

  private clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private updateDimensions(): void {
    const scrollableElement = this.scrollableContentRef().nativeElement;
    const trackElement = this.scrollTrackRef().nativeElement;

    if (scrollableElement && trackElement) {
      const newScrollHeight = scrollableElement.scrollHeight;
      const newClientHeight = scrollableElement.clientHeight;
      const newTrackHeight = trackElement.clientHeight;
      const newScrollTop = scrollableElement.scrollTop;

      this.contentScrollHeight.set(newScrollHeight);
      this.contentClientHeight.set(newClientHeight);
      this.trackClientHeight.set(newTrackHeight);

      if (this.scrollTop() !== newScrollTop) {
        this.scrollTop.set(newScrollTop);
      }
    } else {
      this.contentScrollHeight.set(0);
      this.contentClientHeight.set(0);
      this.trackClientHeight.set(0);
      this.scrollTop.set(0);
    }
  }

  private cleanup(): void {
    this.clearHideTimeout();
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
      this.eventsSubscription = null;
    }
    if (this.observersSubscription) {
      this.observersSubscription.unsubscribe();
      this.observersSubscription = null;
    }
  }

  private setupRouteChanges() {
    this.router.events
      .pipe(
        filter(event=> event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        requestAnimationFrame(() => {
          this.updateDimensions();
        });
      })
    ;
  }
}
