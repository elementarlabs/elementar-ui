import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-unique-visitors-widget',
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './unique-visitors-widget.component.html',
  styleUrl: './unique-visitors-widget.component.scss'
})
export class UniqueVisitorsWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
