import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-total-projects-widget',
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './analytics-total-projects-widget.component.html',
  styleUrl: './analytics-total-projects-widget.component.scss'
})
export class AnalyticsTotalProjectsWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
