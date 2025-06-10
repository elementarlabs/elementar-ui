import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '@elementar-ui/components/form-renderer';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'emr-radio-group-field',
  exportAs: 'emrRadioGroupField',
  imports: [
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './radio-group-field.component.html',
  styleUrl: './radio-group-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioGroupFieldComponent {
  control = input.required<FormControl>();
  fieldConfig = input.required<FieldConfig>();

  getErrorMessage(): string {
    const errors = this.control().errors;
    if (!errors) {
      return '';
    }
    const errorKey = Object.keys(errors)[0];
    const validator = this.fieldConfig().validators?.find(v => v.type === errorKey);
    return validator?.message || 'Invalid value';
  }
}
