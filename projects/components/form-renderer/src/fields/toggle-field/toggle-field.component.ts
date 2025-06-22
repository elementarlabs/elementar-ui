import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../../models/form-config.model';

@Component({
  selector: 'emr-toggle-field',
  exportAs: 'emrToggleField',
  imports: [
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './toggle-field.component.html',
  styleUrl: './toggle-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleFieldComponent {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();
}
