import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../../models/form-config.model';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'emr-select-field',
  exportAs: 'emrSelectField',
  imports: [
    MatError,
    MatHint,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFieldComponent {
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
