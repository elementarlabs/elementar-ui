import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../../models/form-config.model';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatHint } from '@angular/material/form-field';

@Component({
  selector: 'emr-datepicker-field',
  exportAs: 'emrDatepickerField',
  imports: [
    MatHint,
    MatInput,
    MatSuffix,
    MatDatepickerToggle,
    MatDatepicker,
    MatError,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatDatepickerInput
  ],
  templateUrl: './datepicker-field.component.html',
  styleUrl: './datepicker-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerFieldComponent {
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
