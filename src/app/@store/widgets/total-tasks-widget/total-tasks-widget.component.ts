import { Component, inject, input, OnInit } from '@angular/core';
import {
  MchartLineComponent,
  MchartTooltipBodyComponent,
  MchartTooltipComponent,
  MchartTooltipTitleComponent
} from '@elementar-ui/components/micro-chart';
import { Dashboard, DASHBOARD } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-total-tasks-widget',
  templateUrl: './total-tasks-widget.component.html',
  imports: [
    MchartTooltipBodyComponent,
    MchartTooltipComponent,
    MchartTooltipTitleComponent,
    MchartLineComponent
  ],
  styleUrl: './total-tasks-widget.component.scss'
})
export class TotalTasksWidgetComponent implements OnInit {
  data = [47, 54, 38, 24, 65, 37];
  labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
