import { Component, inject, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DASHBOARD } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-current-plan-widget',
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './current-plan-widget.component.html',
  styleUrl: './current-plan-widget.component.scss'
})
export class CurrentPlanWidgetComponent implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
