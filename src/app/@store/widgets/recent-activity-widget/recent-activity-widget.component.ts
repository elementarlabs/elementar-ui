import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-recent-activity-widget',
  imports: [],
  templateUrl: './recent-activity-widget.component.html',
  styleUrl: './recent-activity-widget.component.scss'
})
export class RecentActivityWidgetComponent implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
