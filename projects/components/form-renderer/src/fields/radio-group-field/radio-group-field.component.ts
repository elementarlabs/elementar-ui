import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../../models/form-config.model';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatError, MatHint } from '@angular/material/form-field';

@Component({
  selector: 'emr-radio-group-field',
  exportAs: 'emrRadioGroupField',
  imports: [
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule,
    MatError,
    MatHint,
  ],
  templateUrl: './radio-group-field.component.html',
  styleUrl: './radio-group-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioGroupFieldComponent {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();

  getErrorMessage(): string {
    const errors = this.control().errors;
    if (!errors) {
      return '';
    }
    const errorKey = Object.keys(errors)[0];
    const validator = this.config().validators?.find((v: any) => v.type === errorKey);
    return validator?.message || 'Invalid value';
  }

  get options() {
    return this.config().payload?.['options'] || [];
  }
}
