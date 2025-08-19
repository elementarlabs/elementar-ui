import { Component, inject } from '@angular/core';
import { INCIDENTS } from '../properties';
import { IncidentsComponent } from '../incidents/incidents.component';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'emr-incidents-bar',
  exportAs: 'emrIncidentsBar',
  imports: [
    MatIconButton
  ],
  templateUrl: './incidents-bar.component.html',
  styleUrl: './incidents-bar.component.scss',
  host: {
    'class': 'emr-incidents-bar',
    '(click)': '_handleClick($event)'
  }
})
export class IncidentsBarComponent {
  private _parent = inject<IncidentsComponent>(INCIDENTS, { optional: true });

  _handleClick(_event?: Event) {
    this._parent?.toggleVisibility();
  }
}
