import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

export interface HeadingWidget {
  title: string;
  viewMore?: {
    link: string;
    name: string;
    external: boolean;
  }
}

@Component({
  selector: 'emr-heading-widget',
  imports: [
    RouterLink
  ],
  templateUrl: './heading-widget.component.html',
  styleUrl: './heading-widget.component.css'
})
export class HeadingWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input.required<HeadingWidget>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }

  protected get external(): boolean {
    return this.widget().viewMore?.external || false;
  }
}
