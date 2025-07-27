import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-total-orders-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './analytics-total-orders-widget.component.html',
  styleUrl: './analytics-total-orders-widget.component.scss'
})
export class AnalyticsTotalOrdersWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
