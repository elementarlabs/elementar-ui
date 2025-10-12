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
  readonly scrollTrackXRef = viewChild.required<ElementRef<HTMLElement>>('scrollTrackX');
  readonly scrollThumbXRef = viewChild.required<ElementRef<HTMLElement>>('scrollThumbX');

  readonly scrollbarWidth = input<string>('8px');
  readonly autoHide = input<boolean>(true);
  readonly absolute = input<boolean>(true);

  readonly isDragging = signal(false);
  readonly isHovering = signal(false);
  private readonly scrollTop = signal(0);
  private readonly scrollLeft = signal(0);
  private readonly contentScrollHeight = signal(0);
  private readonly contentScrollWidth = signal(0);
  private readonly contentClientHeight = signal(0);
  private readonly contentClientWidth = signal(0);
  private readonly trackClientHeight = signal(0);
  private readonly trackClientWidth = signal(0);
  private readonly showDueToActivity = signal(false);

  // Vertical axis
  readonly hasScrollY = computed(() => this.contentScrollHeight() > this.contentClientHeight() + 1);
  readonly scrollRatioY = computed(() => this.hasScrollY() ? this.contentClientHeight() / this.contentScrollHeight() : 1);

  readonly minThumbHeight = 20;
  readonly thumbHeight = computed(() => {
    if (!this.hasScrollY()) return 0;
    const trackHeight = this.trackClientHeight();
    const ratio = this.scrollRatioY();
    const calculated = trackHeight * ratio;
    return Math.max(calculated, this.minThumbHeight);
  });
  readonly maxScrollTop = computed(() => Math.max(0, this.contentScrollHeight() - this.contentClientHeight()));
  readonly maxThumbTop = computed(() => Math.max(0, this.trackClientHeight() - this.thumbHeight()));
  readonly thumbTop = computed(() => {
    if (!this.hasScrollY()) return 0;
    const maxScroll = this.maxScrollTop();
    const currentScroll = this.scrollTop();
    const maxThumb = this.maxThumbTop();
    return maxScroll > 0 ? (currentScroll / maxScroll) * maxThumb : 0;
  });

  // Horizontal axis
  readonly hasScrollX = computed(() => this.contentScrollWidth() > this.contentClientWidth() + 1);
  readonly scrollRatioX = computed(() => this.hasScrollX() ? this.contentClientWidth() / this.contentScrollWidth() : 1);

  readonly minThumbWidth = 20;
  readonly thumbWidth = computed(() => {
    if (!this.hasScrollX()) return 0;
    const trackWidth = this.trackClientWidth();
    const ratio = this.scrollRatioX();
    const calculated = trackWidth * ratio;
    return Math.max(calculated, this.minThumbWidth);
  });
  readonly maxScrollLeft = computed(() => Math.max(0, this.contentScrollWidth() - this.contentClientWidth()));
  readonly maxThumbLeft = computed(() => Math.max(0, this.trackClientWidth() - this.thumbWidth()));
  readonly thumbLeft = computed(() => {
    if (!this.hasScrollX()) return 0;
    const maxScroll = this.maxScrollLeft();
    const currentScroll = this.scrollLeft();
    const maxThumb = this.maxThumbLeft();
    return maxScroll > 0 ? (currentScroll / maxScroll) * maxThumb : 0;
  });

  readonly hasAnyScroll = computed(() => this.hasScrollX() || this.hasScrollY());
  readonly isVisible = computed(() => {
    if (!this.hasAnyScroll()) return false;
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
      this.scrollTrackXRef();
      this.scrollThumbXRef();

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

  private raf(cb: () => void): void {
    // Use requestAnimationFrame in the browser, fallback to setTimeout on SSR
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => cb());
    } else {
      setTimeout(() => cb(), 0);
    }
  }

  private setupStyleEffects(): void {
    // Vertical thickness (width) and horizontal thickness (height)
    effect(() => {
      const thickness = this.scrollbarWidth();
      const trackY = this.scrollTrackRef().nativeElement;
      const thumbY = this.scrollThumbRef().nativeElement;
      const trackX = this.scrollTrackXRef().nativeElement;
      const thumbX = this.scrollThumbXRef().nativeElement;
      untracked(() => {
        // Vertical scrollbar: width is thickness
        this.renderer.setStyle(trackY, 'width', thickness);
        this.renderer.setStyle(thumbY, 'width', thickness);
        // Horizontal scrollbar: height is thickness
        this.renderer.setStyle(trackX, 'height', thickness);
        this.renderer.setStyle(thumbX, 'height', thickness);
      });
    });

    // Vertical thumb height
    effect(() => {
      const height = this.thumbHeight();
      const thumbElement = this.scrollThumbRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(thumbElement, 'height', `${height}px`);
      });
    });

    // Vertical thumb position
    effect(() => {
      const top = this.thumbTop();
      const thumbElement = this.scrollThumbRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(thumbElement, 'transform', `translateY(${top}px)`);
      });
    });

    // Horizontal thumb width
    effect(() => {
      const width = this.thumbWidth();
      const thumbElementX = this.scrollThumbXRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(thumbElementX, 'width', `${width}px`);
      });
    });

    // Horizontal thumb position
    effect(() => {
      const left = this.thumbLeft();
      const thumbElementX = this.scrollThumbXRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(thumbElementX, 'transform', `translateX(${left}px)`);
      });
    });

    // Toggle track visibility per axis based on content
    effect(() => {
      const hasY = this.hasScrollY();
      const trackY = this.scrollTrackRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(trackY, 'display', hasY ? 'block' : 'none');
      });
    });
    effect(() => {
      const hasX = this.hasScrollX();
      const trackX = this.scrollTrackXRef().nativeElement;
      untracked(() => {
        this.renderer.setStyle(trackX, 'display', hasX ? 'block' : 'none');
      });
    });

    // When scrollability toggles, recompute dimensions after tracks are laid out
    effect(() => {
      // depend on both so we run when either axis scrollability changes
      const _hasY = this.hasScrollY();
      const _hasX = this.hasScrollX();
      untracked(() => {
        // Wait for style changes (display:block/none) to apply, then measure
        this.raf(() => {
          this.zone.run(() => this.updateDimensions());
        });
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
    const thumbElementY = this.scrollThumbRef().nativeElement;
    const thumbElementX = this.scrollThumbXRef().nativeElement;

    const scroll$ = fromEvent(scrollableElement, 'scroll', { passive: true }).pipe(
      tap(() => {
        this.zone.run(() => {
          this.scrollTop.set(scrollableElement.scrollTop);
          this.scrollLeft.set(scrollableElement.scrollLeft);
        });
        // Imperative sync to ensure thumbs move with content during scroll
        this.zone.runOutsideAngular(() => {
          this.raf(() => {
            const top = untracked(this.thumbTop);
            const left = untracked(this.thumbLeft);
            this.renderer.setStyle(thumbElementY, 'transform', `translateY(${top}px)`);
            this.renderer.setStyle(thumbElementX, 'transform', `translateX(${left}px)`);
          });
        });
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

    const thumbMouseDownY$ = fromEvent<MouseEvent>(thumbElementY, 'mousedown');
    const thumbMouseDownX$ = fromEvent<MouseEvent>(thumbElementX, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

    const thumbDragY$ = thumbMouseDownY$.pipe(
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

    const thumbDragX$ = thumbMouseDownX$.pipe(
      tap(event => {
        event.preventDefault();
        event.stopPropagation();
      }),
      switchMap(startEvent => {
        const startX = startEvent.clientX;
        const startScrollLeft = scrollableElement.scrollLeft;
        const initialTrackWidth = untracked(() => this.trackClientWidth());
        const initialContentWidth = untracked(() => this.contentScrollWidth());

        this.zone.run(() => this.isDragging.set(true));

        return mouseMove$.pipe(
          map(moveEvent => {
            moveEvent.preventDefault();
            const deltaX = moveEvent.clientX - startX;
            const scrollDelta = initialTrackWidth > 0
              ? (deltaX / initialTrackWidth) * initialContentWidth
              : 0;
            return startScrollLeft + scrollDelta;
          }),
          distinctUntilChanged(),
          tap(newScrollLeft => {
            this.renderer.setProperty(scrollableElement, 'scrollLeft', newScrollLeft);
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
        thumbDragY$,
        thumbDragX$
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
    const trackElementY = this.scrollTrackRef().nativeElement;
    const trackElementX = this.scrollTrackXRef().nativeElement;

    if (scrollableElement && trackElementY && trackElementX) {
      // Vertical metrics
      const newScrollHeight = scrollableElement.scrollHeight;
      const newClientHeight = scrollableElement.clientHeight;
      const newTrackHeight = trackElementY.clientHeight;
      const newScrollTop = scrollableElement.scrollTop;

      this.contentScrollHeight.set(newScrollHeight);
      this.contentClientHeight.set(newClientHeight);
      this.trackClientHeight.set(newTrackHeight);

      if (this.scrollTop() !== newScrollTop) {
        this.scrollTop.set(newScrollTop);
      }

      // Horizontal metrics
      const newScrollWidth = scrollableElement.scrollWidth;
      const newClientWidth = scrollableElement.clientWidth;
      const newTrackWidth = trackElementX.clientWidth;
      const newScrollLeft = scrollableElement.scrollLeft;

      this.contentScrollWidth.set(newScrollWidth);
      this.contentClientWidth.set(newClientWidth);
      this.trackClientWidth.set(newTrackWidth);

      if (this.scrollLeft() !== newScrollLeft) {
        this.scrollLeft.set(newScrollLeft);
      }
    } else {
      this.contentScrollHeight.set(0);
      this.contentClientHeight.set(0);
      this.trackClientHeight.set(0);
      this.scrollTop.set(0);

      this.contentScrollWidth.set(0);
      this.contentClientWidth.set(0);
      this.trackClientWidth.set(0);
      this.scrollLeft.set(0);
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
        this.raf(() => {
          this.updateDimensions();
        });
      })
    ;
  }
}
