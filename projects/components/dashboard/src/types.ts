import { InjectionToken, InputSignal } from '@angular/core';

export interface Dashboard {
  markWidgetAsLoaded(id: any): void;
}

export interface WidgetComponent {
  widget: InputSignal<Widget | undefined>;
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
  widget?: Widget;
}

export interface Widget {
  [propName: string]: any;
}

export const DASHBOARD = new InjectionToken('DASHBOARD');
