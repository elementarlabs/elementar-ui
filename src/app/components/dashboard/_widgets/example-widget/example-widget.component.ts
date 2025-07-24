import { Component, inject, input, OnInit } from '@angular/core';
import { Dashboard, DASHBOARD, Widget } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'app-example-widget',
  imports: [],
  templateUrl: './example-widget.component.html',
  styleUrl: './example-widget.component.scss'
})
export class ExampleWidgetComponent implements OnInit {
  // private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  readonly widget = input.required<Widget>();

  ngOnInit() {
    // if (this._dashboard) {
    //   this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    // }
  }
}
