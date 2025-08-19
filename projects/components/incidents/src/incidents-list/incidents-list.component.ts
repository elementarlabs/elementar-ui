import { booleanAttribute, Component, inject, input } from '@angular/core';
import { IncidentsComponent } from '../incidents/incidents.component';
import { INCIDENTS } from '../properties';

@Component({
  selector: 'emr-incidents-list',
  exportAs: 'emr-incidents-list',
  templateUrl: './incidents-list.component.html',
  styleUrl: './incidents-list.component.scss',
  host: {
    'class': 'emr-incidents-list',
    '[class.is-fixed]': 'fixed()',
    '(click)': '_handleClick($event)'
  }
})
export class IncidentsListComponent {
  private _parent = inject<IncidentsComponent>(INCIDENTS, { optional: true });

  fixed = input(false, {
    transform: booleanAttribute
  });

  _handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('.emr-incident') === null) {
      this._parent?.toggleVisibility();
    }
  }
}
