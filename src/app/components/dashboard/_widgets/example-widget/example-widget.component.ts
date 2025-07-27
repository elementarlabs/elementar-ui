import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-example-widget',
  imports: [],
  templateUrl: './example-widget.component.html',
  styleUrl: './example-widget.component.scss'
})
export class ExampleWidgetComponent implements OnInit {
  // private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  readonly id = input.required<any>();
  readonly widget = input.required<any>();

  ngOnInit() {
    // if (this._dashboard) {
    //   this._dashboard.markWidgetAsLoaded(this.id());
    // }
  }
}
