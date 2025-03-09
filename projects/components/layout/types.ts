import { InjectionToken } from '@angular/core';
import { StateLayoutId } from './layout.store';

export const LAYOUT = new InjectionToken<StateLayoutId>('LAYOUT');

export interface LayoutSidebarVisibilityChange {
  layoutId: string;
  shown: boolean;
}
