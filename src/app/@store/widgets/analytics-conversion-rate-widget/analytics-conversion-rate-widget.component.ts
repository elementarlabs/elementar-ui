import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'app-analytics-conversion-rate-widget',
  imports: [],
  templateUrl: './analytics-conversion-rate-widget.component.html',
  styleUrl: './analytics-conversion-rate-widget.component.scss'
})
export class AnalyticsConversionRateWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
