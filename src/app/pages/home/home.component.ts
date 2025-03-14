import { Component } from '@angular/core';
import {
  DashboardComponent,
  Widget,
  WidgetConfig,
} from '@elementar-ui/components/dashboard';

@Component({
  selector: 'app-home',
  imports: [DashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  configs: WidgetConfig[] = [
    {
      type: 'table-widget',
      skeleton: null,
      component: () =>
        import('../../widgets/table-widget/table-widget.component').then(
          c => c.TableWidgetComponent
        ),
    },
    {
      type: 'recipt-widget',
      skeleton: null,
      component: () =>
        import('../../widgets/recipt-widget/recipt-widget.component').then(
          c => c.ReciptWidgetComponent
        ),
    },
  ];

  widgets: Widget[] = [
    {
      id: 1,
      type: 'table-widget',
      columns: 8,
    },
    {
      id: 2,
      type: 'recipt-widget',
      columns: 4,
    },
  ];
}
