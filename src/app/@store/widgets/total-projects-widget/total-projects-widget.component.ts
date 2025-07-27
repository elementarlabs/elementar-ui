import { Component, inject, input, OnInit } from '@angular/core';
import {
  MchartLineComponent, MchartTooltipBodyComponent,
  MchartTooltipComponent,
  MchartTooltipTitleComponent
} from '@elementar-ui/components/micro-chart';
import { Dashboard, DASHBOARD } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-total-projects-widget',
  imports: [
    MchartLineComponent,
    MchartTooltipComponent,
    MchartTooltipTitleComponent,
    MchartTooltipBodyComponent
  ],
  templateUrl: './total-projects-widget.component.html',
  styleUrl: './total-projects-widget.component.scss'
})
export class TotalProjectsWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  data = [47, 54, 38, 24, 65, 37];
  labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  id = input.required<any>();
  widget = input();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
