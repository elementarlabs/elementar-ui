import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../../models/form-config.model';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'emr-slide-toggle-field',
  imports: [
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './slide-toggle-field.component.html',
  styleUrl: './slide-toggle-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleFieldComponent {
  control = input.required<FormControl>();
  fieldConfig = input.required<FieldConfig>();
}
