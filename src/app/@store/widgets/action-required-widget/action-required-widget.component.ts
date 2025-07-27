import { Component, inject, input, OnInit } from '@angular/core';
import { ActionRequiredComponent } from '@elementar-ui/components/action-required';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

export interface ActionRequiredWidget {
  iconName?: string;
  description: string;
  buttonText: string;
  actionText: string;
}

@Component({
  selector: 'emr-action-required-widget',
  exportAs: 'emrActionRequiredWidget',
  imports: [
    ActionRequiredComponent
  ],
  templateUrl: './action-required-widget.component.html',
  styleUrl: './action-required-widget.component.css',
  host: {
    'class': 'emr-action-required-widget'
  }
})
export class ActionRequiredWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<ActionRequiredWidget>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
