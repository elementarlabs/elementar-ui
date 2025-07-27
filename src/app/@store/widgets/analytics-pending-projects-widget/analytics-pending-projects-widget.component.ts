import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-analytics-pending-projects-widget',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './analytics-pending-projects-widget.component.html',
  styleUrl: './analytics-pending-projects-widget.component.scss'
})
export class AnalyticsPendingProjectsWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
