import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'app-analytics-active-users-widget',
  imports: [],
  templateUrl: './analytics-active-users-widget.component.html',
  styleUrl: './analytics-active-users-widget.component.scss'
})
export class AnalyticsActiveUsersWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
