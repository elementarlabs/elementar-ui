import {
  booleanAttribute,
  Component, ElementRef,
  inject,
  contentChild, TemplateRef, input, ChangeDetectionStrategy, computed
} from '@angular/core';
import { NavigationItemIconDirective } from '../navigation-item-icon.directive';
import { MatRipple } from '@angular/material/core';
import { NgTemplateOutlet } from '@angular/common';
import { NAVIGATION, NAVIGATION_GROUP } from '../types';
import { NavigationComponent } from '../navigation/navigation.component';
import { NavigationStore } from '../navigation.store';
import { NavigationGroupComponent } from '../navigation-group/navigation-group.component';

let nextKey = 0;

@Component({
  selector: 'emr-navigation-item,[emr-navigation-item]',
  exportAs: 'emrNavigationItem',
  imports: [
    MatRipple,
    NgTemplateOutlet
  ],
  templateUrl: './navigation-item.component.html',
  styleUrl: './navigation-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-navigation-item',
    '[class.is-active]': 'forceActive() || active()',
    '[class.is-badge-text-only]': 'badgeTextOnly()',
    '(click)': 'click($event)'
  }
})
export class NavigationItemComponent {
  private store= inject(NavigationStore);
  private _navigation = inject<NavigationComponent>(NAVIGATION);
  private _elementRef = inject(ElementRef);
  private parentGroup = inject<NavigationGroupComponent>(NAVIGATION_GROUP, { optional: true });

  protected readonly iconRef = contentChild(NavigationItemIconDirective);
  readonly active = computed(() => {
    return this.store.activeKey() === this.key();
  });

  get api() {
    return {
      isActive: () => this.active()
    }
  }

  readonly key = input<any>(`emr-navigation-item-${nextKey++}`);
  readonly forceActive = input(false, {
    transform: booleanAttribute
  });
  readonly badgeTextOnly = input(false, {
    transform: booleanAttribute
  });

  protected click(event: MouseEvent) {
    if (!this.key()) {
      return;
    }

    this._navigation.itemClicked.emit(this.key());
    this.store.setActiveKey(this.key());

    if (this.parentGroup) {
      this.store.setActiveGroupKey(this.parentGroup.key());
    } else {
      this.store.setActiveGroupKey(null);
    }
  }

  get _hostElement(): ElementRef {
    return this._elementRef;
  }

  protected get iconRefTemplate(): TemplateRef<any> {
    return this.iconRef()?.templateRef as TemplateRef<any>;
  }
}
