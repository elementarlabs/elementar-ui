import { InjectionToken } from '@angular/core';

export const TAB_PANEL_NAV = new InjectionToken('TAB_PANEL_NAV');
export const TAB_PANEL_ASIDE = new InjectionToken('TAB_PANEL_ASIDE');

export interface TabPanelVisibilityChange {
  layoutId: string;
  shown: boolean;
}
