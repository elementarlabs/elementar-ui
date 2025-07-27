import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'app-analytics-total-users-widget',
  imports: [],
  templateUrl: './analytics-total-users-widget.component.html',
  styleUrl: './analytics-total-users-widget.component.scss'
})
export class AnalyticsTotalUsersWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
