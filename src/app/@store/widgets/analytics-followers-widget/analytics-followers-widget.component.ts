import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-followers-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './analytics-followers-widget.component.html',
  styleUrl: './analytics-followers-widget.component.scss'
})
export class AnalyticsFollowersWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
