import {
  afterNextRender,
  Component, ElementRef,
  inject, Renderer2,
  contentChildren,
  SimpleChanges,
  input,
  OnChanges, output, forwardRef, AfterContentInit, booleanAttribute, ChangeDetectorRef, ChangeDetectionStrategy,
  DestroyRef
} from '@angular/core';
import { NavigationItemComponent } from '../navigation-item/navigation-item.component';
import { NAVIGATION, NavigationItem } from '../types';
import { Location } from '@angular/common';
import { NavigationStore } from '../navigation.store';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'emr-navigation',
  exportAs: 'emrNavigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  providers: [
    NavigationStore,
    {
      provide: NAVIGATION,
      useExisting: forwardRef(() => NavigationComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-navigation'
  }
})
export class NavigationComponent implements AfterContentInit, OnChanges {
  private store= inject(NavigationStore);
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private location = inject(Location);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly _items = contentChildren(NavigationItemComponent, { descendants: true });

  activeKey = input<any>();
  appearance = input();
  activateByRoute = input(false, {
    transform: booleanAttribute
  })
  autoScrollToActiveItem = input(false, {
    transform: booleanAttribute
  });

  readonly itemClicked = output<NavigationItem>();

  constructor() {
    // scroll to the active item if it is not visible in the viewport
    afterNextRender(() => {
      if (!this.autoScrollToActiveItem()) {
        return;
      }

      this._items().forEach((item: NavigationItemComponent) => {
        if (item.active()) {
          let parentElement = this._elementRef.nativeElement.parentNode || null;
          const itemElement = item._hostElement.nativeElement as HTMLElement;

          while (parentElement !== null) {
            if (this._hasScroll(parentElement)) {
              if (!this._isScrolledIntoView(itemElement, parentElement)) {
                const parentRect = parentElement.getBoundingClientRect();
                const elementRect = itemElement.getBoundingClientRect();
                parentElement.scrollTop = elementRect.top - parentRect.height / 2;
              }

              parentElement = null;
            } else {
              parentElement = parentElement.parentNode || null;
            }
          }
        }
      });
    });
  }

  ngAfterContentInit() {
    if (!this.activateByRoute()) {
      return;
    }

    this.findActiveItemByRoute();
    this.router
      .events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.findActiveItemByRoute();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeKey']) {
      this.store.setActiveKey(changes['activeKey'].currentValue);
    }

    if (changes['appearance']) {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'data-appearance', changes['appearance'].currentValue);
    }
  }

  private _hasScroll(element: HTMLElement): boolean {
    if (!element.getBoundingClientRect) {
      return false;
    }

    return Math.ceil(element.scrollHeight) > Math.ceil(element.getBoundingClientRect().height);
  }

  private _isScrolledIntoView(element: HTMLElement, parent: HTMLElement) {
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return (elementRect.top >= 0) && (elementRect.bottom <= parentRect.height);
  }

  private findActiveItemByRoute() {
    const activeItem = this._items().find((item: NavigationItemComponent) => {
      const element = item._hostElement.nativeElement as HTMLElement;

      if (element.tagName === 'A') {
        const href = element.getAttribute('href');

        if (href) {
          if (href === this.location.path()) {
            return true;
          }

          return href !== '/' && this.location.path().includes(href);
        }
      }

      return null;
    });

    if (activeItem) {
      this.store.setActiveKey(activeItem.key());
    }
  }
}
