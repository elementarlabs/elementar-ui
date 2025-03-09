import { Component, computed, inject, input } from '@angular/core';
import { LayoutSidebarStore, StateLayoutId } from '@elementar-ui/components/layout';

@Component({
  selector: 'emr-tab-panel-aside',
  exportAs: 'emrTabPanelAside',
  templateUrl: './tab-panel-aside.component.html',
  styleUrl: './tab-panel-aside.component.scss',
  host: {
    'class': 'emr-tab-panel-aside',
    '[class.is-hidden]': '!_isShown()',
    'layoutId': 'drawer'
  }
})
export class TabPanelAsideComponent {
  nextId =0;
  layoutId = input<StateLayoutId>('drawer');
  private _layoutSidebarStore = inject(LayoutSidebarStore);

  protected _isShown = computed<boolean>(() => {
    if (this.layoutId() in this._layoutSidebarStore) {
      return this._layoutSidebarStore.getSidebarVisibility(this.layoutId());
    }
    return true;
  });
}
