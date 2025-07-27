import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-analytics-ended-projects-widget',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './analytics-ended-projects-widget.component.html',
  styleUrl: './analytics-ended-projects-widget.component.scss'
})
export class AnalyticsEndedProjectsWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
