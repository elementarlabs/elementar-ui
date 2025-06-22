import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../../models/form-config.model';
import { TimezoneSelectComponent } from '@elementar-ui/components/timezone-select';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'emr-timezone-field',
  exportAs: 'emrTimezoneField',
  imports: [
    MatError,
    MatFormField,
    MatLabel,
    TimezoneSelectComponent,
    ReactiveFormsModule,
    MatHint
  ],
  templateUrl: './timezone-field.component.html',
  styleUrl: './timezone-field.component.scss'
})
export class TimezoneFieldComponent {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();

  getErrorMessage(): string {
    const errors = this.control().errors;
    if (!errors) return '';
    const errorKey = Object.keys(errors)[0];
    const validator = this.config().validators?.find((v: any) => v.type === errorKey);
    return validator?.message || 'Invalid value';
  }
}
