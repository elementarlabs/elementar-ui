import {
  Component,
  inject,
  contentChild,
  TemplateRef,
  computed,
  ChangeDetectionStrategy,
  input,
  booleanAttribute
} from '@angular/core';
import { NavigationGroupToggleIconDirective } from '../navigation-group-toggle-icon.directive';
import { MatRipple } from '@angular/material/core';
import { NgTemplateOutlet } from '@angular/common';
import { NAVIGATION_GROUP } from '../types';
import { NavigationGroupComponent } from '../navigation-group/navigation-group.component';
import { NavigationStore } from '../navigation.store';

@Component({
  selector: 'emr-navigation-group-toggle',
  exportAs: 'emrNavigationGroupToggle',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './navigation-group-toggle.component.html',
  styleUrl: './navigation-group-toggle.component.scss',
  hostDirectives: [
    MatRipple
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-navigation-group-toggle',
    '[class.is-active]': 'active()',
    '[class.is-badge-text-only]': 'badgeTextOnly()',
    '(click)': 'toggle($event)'
  }
})
export class NavigationGroupToggleComponent {
  private store= inject(NavigationStore);
  private _group = inject<NavigationGroupComponent>(NAVIGATION_GROUP);

  readonly iconRef = contentChild(NavigationGroupToggleIconDirective);
  readonly active = computed(() => {
    return this.store.activeGroupKey() === this._group.key();
  });
  readonly badgeTextOnly = input(false, {
    transform: booleanAttribute
  });

  protected toggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.active()) {
      this.store.setActiveGroupKey(null);
    } else {
      this.store.setActiveGroupKey(this._group.key());
    }
  }

  protected get iconRefTemplate(): TemplateRef<any> {
    return this.iconRef()?.templateRef as TemplateRef<any>;
  }
}
