import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  inject,
  contentChildren,
  computed,
  ChangeDetectionStrategy,
  effect
} from '@angular/core';
import { NavigationItemComponent } from '../navigation-item/navigation-item.component';
import { NAVIGATION_GROUP } from '../types';
import { NavigationGroupComponent } from '../navigation-group/navigation-group.component';
import { NavigationStore } from '../navigation.store';

@Component({
  selector: 'emr-navigation-group-menu',
  exportAs: 'emrNavigationGroupMenu',
  templateUrl: './navigation-group-menu.component.html',
  styleUrl: './navigation-group-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-navigation-group-menu',
    '[class.is-active]': 'active()'
  }
})
export class NavigationGroupMenuComponent implements AfterContentInit {
  private store= inject(NavigationStore);
  private _group = inject<NavigationGroupComponent>(NAVIGATION_GROUP);

  readonly active = computed(() => {
    return this.store.activeGroupKey() === this._group.key();
  });
  readonly _items = contentChildren(
    NavigationItemComponent, { descendants: true }
  );
  readonly hasActiveItemInGroup = computed(() => {
    return this._items().filter(
      itemComponent => this.store.activeKey() === itemComponent.key()
    ).length > 0
  });

  ngAfterContentInit() {
    this._detectGroupIsActive();
  }

  private _detectGroupIsActive() {
    if (this.hasActiveItemInGroup() && !this.active()) {
      this.store.setActiveGroupKey(this._group.key());
    } else {
      if (this.store.activeGroupKey() === this._group.key()) {
        this.store.setActiveGroupKey(null);
      } else {
        this.store.setActiveGroupKey(this._group.key());
      }
    }
  }
}
