import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../../models/form-config.model';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatHint } from '@angular/material/form-field';

@Component({
  selector: 'emr-datepicker-field',
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
  fieldConfig = input.required<FieldConfig>();

  getErrorMessage(): string {
    const errors = this.control().errors;
    if (!errors) return '';
    const errorKey = Object.keys(errors)[0];
    const validator = this.fieldConfig().validators?.find(v => v.type === errorKey);
    return validator?.message || 'Invalid value';
  }
}
