import { Component, computed, inject } from '@angular/core';
import { TAB_PANEL_ASIDE } from '../types';
import { LayoutSidebarStore } from '@elementar-ui/components/layout';

@Component({
  selector: 'emr-tab-panel-aside',
  exportAs: 'emrTabPanelAside',
  templateUrl: './tab-panel-aside.component.html',
  styleUrl: './tab-panel-aside.component.scss',
  providers: [
    {
      provide: TAB_PANEL_ASIDE,
      useExisting: TabPanelAsideComponent
    }
  ],
  host: {
    'class': 'emr-tab-panel-aside',
    '[class.is-hidden]': '!_isShown()',
    'layoutId': 'drawer'
  }
})
export class TabPanelAsideComponent {
  nextId = 0;

  private _layoutSidebarStore = inject(LayoutSidebarStore);

  protected _isShown = computed<boolean>(() => {
    if ('drawer' in this._layoutSidebarStore) {
      console.log('drawer found in layout sidebar store');
      return this._layoutSidebarStore.getSidebarVisibility('drawer');
    }

    console.log('drawer not found in layout sidebar store');

    return true;
  });
}
