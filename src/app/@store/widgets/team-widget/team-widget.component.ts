import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AvatarComponent } from '@elementar-ui/components/avatar';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-team-widget',
  imports: [
    MatIcon,
    MatIconButton,
    AvatarComponent
  ],
  templateUrl: './team-widget.component.html',
  styleUrl: './team-widget.component.scss'
})
export class TeamWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
