import { InjectionToken, InputSignal } from '@angular/core';

export interface Dashboard {
  markWidgetAsLoaded(id: any): void;
}

export interface WidgetComponent {
  id: InputSignal<any>;
  widget?: InputSignal<any>;
}

export interface WidgetConfig {
  type: string;
  skeleton?: any;
  plain?: boolean;
  component: () => Promise<any>;
}

export interface WidgetItem {
  id: any;
  type: string;
  columns: number;
  skeletonHeight?: string;
  height?: string;
  widget?: any; // widget data or nothing
}

export const DASHBOARD = new InjectionToken('DASHBOARD');
