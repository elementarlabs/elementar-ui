import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../../models/form-config.model';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'emr-checkbox-field',
  imports: [
    MatCheckbox,
    ReactiveFormsModule
  ],
  templateUrl: './checkbox-field.component.html',
  styleUrl: './checkbox-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldComponent {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();
}
