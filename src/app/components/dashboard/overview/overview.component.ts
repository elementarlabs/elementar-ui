import { Component, signal } from '@angular/core';
import { DashboardComponent, WidgetConfig, WidgetItem } from '@elementar-ui/components/dashboard';
import { PageComponent } from '@meta/page/page.component';
import { PageTitleDirective } from '@meta/page/page-title.directive';

@Component({
  imports: [
    DashboardComponent,
    PageComponent,
    PageTitleDirective
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  configs = signal<WidgetConfig[]>([
    {
      type: 'example-widget',
      component: () =>
        import('../_widgets/example-widget/example-widget.component')
          .then(c => c.ExampleWidgetComponent)
    },
  ]);
  items = signal<WidgetItem[]>([
    {
      id: crypto.randomUUID(),
      type: 'example-widget',
      columns: 4,
      height: '200px',
      widget: {
        name: 'Example Widget',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'example-widget',
      columns: 4,
      height: '200px',
      widget: {
        name: 'Example Widget 2',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'example-widget',
      columns: 4,
      height: '200px',
      widget: {
        name: 'Example Widget 3',
      }
    },
    {
      id: crypto.randomUUID(),
      columns: 8,
      children: [
        {
          id: crypto.randomUUID(),
          type: 'example-widget',
          columns: 12,
          height: '300px',
          widget: {
            name: 'Example Widget 6',
          }
        },
        {
          id: crypto.randomUUID(),
          type: 'example-widget',
          columns: 6,
          height: '178px',
          widget: {
            name: 'Example Widget 5',
          }
        },
        {
          id: crypto.randomUUID(),
          type: 'example-widget',
          columns: 6,
          height: '178px',
          widget: {
            name: 'Example Widget 6',
          }
        },
        {
          id: crypto.randomUUID(),
          type: 'example-widget',
          columns: 6,
          height: '100px',
          widget: {
            name: 'Example Widget 6',
          }
        },
        {
          id: crypto.randomUUID(),
          type: 'example-widget',
          columns: 6,
          height: '100px',
          widget: {
            name: 'Example Widget 6',
          }
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      columns: 4,
      children: [
        {
          id: crypto.randomUUID(),
          type: 'example-widget',
          columns: 12,
          height: '300px',
          widget: {
            name: 'Example Widget 2',
          }
        },
        {
          id: crypto.randomUUID(),
          type: 'example-widget',
          columns: 12,
          height: '300px',
          widget: {
            name: 'Example Widget 3',
          }
        },
      ],
      widget: {
        name: 'Example Widget 4',
      }
    },
  ]);
}
