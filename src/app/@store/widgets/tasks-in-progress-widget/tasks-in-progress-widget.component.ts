import { Component, inject, input, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AvatarComponent } from '@elementar-ui/components/avatar';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-tasks-in-progress-widget',
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    AvatarComponent
  ],
  templateUrl: './tasks-in-progress-widget.component.html',
  styleUrl: './tasks-in-progress-widget.component.scss'
})
export class TasksInProgressWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
