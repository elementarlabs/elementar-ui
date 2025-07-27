import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'app-analytics-new-signups-widget',
  imports: [],
  templateUrl: './analytics-new-signups-widget.component.html',
  styleUrl: './analytics-new-signups-widget.component.scss'
})
export class AnalyticsNewSignupsWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
