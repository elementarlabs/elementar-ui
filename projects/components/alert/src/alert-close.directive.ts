import { Directive, inject } from '@angular/core';
import { ALERT } from './alert.properties';
import { AlertComponent } from './alert/alert.component';

@Directive({
    selector: '[emrAlertClose]',
    exportAs: 'emrAlertClose',
    host: {
      'class': 'emr-alert-close',
      '(click)': '_handleClick()'
    }
})
export class AlertCloseDirective {
  private _alert = inject<AlertComponent>(ALERT);

  protected _handleClick() {
    this._alert.api.close();
  }
}
