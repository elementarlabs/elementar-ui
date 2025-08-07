import { Component } from '@angular/core';
import { DateFormatSelectComponent } from '@elementar-ui/components/date-format-select';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-date-format-select-example',
  imports: [
    MatError,
    DateFormatSelectComponent,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './basic-date-format-select-example.component.html',
  styleUrl: './basic-date-format-select-example.component.scss'
})
export class BasicDateFormatSelectExampleComponent {
  readonly settingsForm = new FormGroup({
    // dateFormat: new FormControl<string | null>('yyyy-MM-dd', Validators.required),
    dateFormat: new FormControl<string | null>(null, Validators.required),
  });

  get dateFormatControl(): FormControl | null {
    return this.settingsForm.get('dateFormat') as FormControl | null;
  }
}
