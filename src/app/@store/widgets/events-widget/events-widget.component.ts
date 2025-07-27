import { Component, inject, input, OnInit } from '@angular/core';
import {
  AvatarComponent,
  AvatarGroupComponent,
  AvatarMoreComponent,
} from '@elementar-ui/components/avatar';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-events-widget',
  templateUrl: './events-widget.component.html',
  imports: [
    AvatarGroupComponent,
    AvatarComponent,
    AvatarMoreComponent
  ],
  styleUrl: './events-widget.component.scss'
})
export class EventsWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
