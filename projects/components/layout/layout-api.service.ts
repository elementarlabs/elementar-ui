import { EventEmitter, inject, Injectable } from '@angular/core';
import { LayoutSidebarVisibilityChange } from './types';
import { LayoutSidebarStore, StateLayoutId } from './layout.store';

@Injectable({
  providedIn: 'root'
})
export class LayoutApiService {

  private _layoutSidebarStore = inject(LayoutSidebarStore);
  readonly sidebarVisibility = new EventEmitter<LayoutSidebarVisibilityChange>();

  hideSidebar(layoutId: StateLayoutId): void {
    this._layoutSidebarStore.showSidebarVisibility(layoutId, false);
    this.sidebarVisibility.emit({
      layoutId,
      shown: false
    });
  }

  showSidebar(layoutId: StateLayoutId): void {
    this._layoutSidebarStore.showSidebarVisibility(layoutId, true);
    this.sidebarVisibility.emit({
      layoutId,
      shown: true
    });
  }

toggleSidebar(layoutId: StateLayoutId): void {
  if (this.isSidebarShown(layoutId)) {
    this.hideSidebar(layoutId);
  } else {
    this.showSidebar(layoutId);
  }
}

  isSidebarShown(layoutId: StateLayoutId): boolean {
    return this._layoutSidebarStore.getSidebarVisibility(layoutId)
  }

}
