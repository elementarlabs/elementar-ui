import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  RadioCardComponent,
  RadioCardContentComponent,
  RadioCardGroupComponent, RadioCardTitleComponent
} from '@elementar-ui/components/radio-card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-radio-card-example',
  imports: [
    RadioCardComponent,
    RadioCardGroupComponent,
    ReactiveFormsModule,
    MatIcon,
    RadioCardContentComponent,
    RadioCardTitleComponent,
    MatButton,
  ],
  templateUrl: './radio-card-example.component.html',
  styleUrl: './radio-card-example.component.scss'
})
export class RadioCardExampleComponent {
  form = new FormGroup({
    privacy: new FormControl('open'),
  });

  toggleDisabled(): void {
    const control = this.form.get('privacy');
    if (control) {
      control.disabled ? control.enable() : control.disable();
    }
  }
}
