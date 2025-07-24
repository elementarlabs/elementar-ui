import {
  booleanAttribute,
  Component,
  forwardRef,
  input,
  OnInit,
  signal
} from '@angular/core';
import {
  DASHBOARD, WidgetConfig, WidgetItem
} from '../types';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { WidgetSkeletonComponent } from '../widget-skeleton/widget-skeleton.component';

@Component({
  selector: 'emr-dashboard',
  exportAs: 'emrDashboard',
  imports: [
    NgComponentOutlet,
    AsyncPipe,
    WidgetSkeletonComponent
  ],
  providers: [
    {
      provide: DASHBOARD,
      useExisting: forwardRef(() => DashboardComponent),
    }
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  host: {
    'class': 'emr-dashboard'
  }
})
export class DashboardComponent implements OnInit {
  protected _skeletonMap = new Map<string, any>();
  protected _componentsMap = new Map<string, any>();

  readonly configs = input<WidgetConfig[]>([]);
  readonly items = input<WidgetItem[]>([]);
  readonly plain = input(false, {
    transform: booleanAttribute
  });
  readonly waitWhenAllWidgetLoaded = input(false, {
    transform: booleanAttribute
  });

  protected _allLoaded = signal(false);
  protected _loadedWidgetsCount = signal(0);

  ngOnInit() {
    if (this.configs().length === 0) {
      return;
    }

    if (!this.waitWhenAllWidgetLoaded()) {
      this._allLoaded.set(true);
    }

    this.configs().forEach(config => {
      this._skeletonMap.set(config.type, config.skeleton);
    });
    this.configs().forEach(async (config, index: number) => {
      this._componentsMap.set(config.type, config.component());
    });
  }

  markWidgetAsLoaded(id: any) {
    this._loadedWidgetsCount.set(this._loadedWidgetsCount() + 1);
    this._allLoaded.set(this._loadedWidgetsCount() === this.items().length);
  }

  protected getWidgetConfig(type: string): WidgetConfig {
    return this.configs().find(config => config.type === type) as WidgetConfig;
  }

  protected getSkeletonComponent(type: string): any {
    return this._skeletonMap.get(type);
  }

  protected getWidgetComponent(type: string) {
    return this._componentsMap.get(type);
  }

  protected getWidgetInputs(widgetItem: WidgetItem): any {
    return widgetItem.widget ? { widget: widgetItem.widget } : {};
  }
}
