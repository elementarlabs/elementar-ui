import { Component, inject, input, OnInit } from '@angular/core';
import {
  DASHBOARD,
  Dashboard,
  Widget,
  WidgetComponent,
} from '@elementar-ui/components/dashboard';

@Component({
  selector: 'app-recipt-widget',
  imports: [],
  templateUrl: './recipt-widget.component.html',
  styleUrl: './recipt-widget.component.scss',
})
export class ReciptWidgetComponent implements WidgetComponent, OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<Widget>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.id);
    }
  }
}
