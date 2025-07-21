import { Component, model } from '@angular/core';
import { CountrySelectComponent } from '@elementar-ui/components/country-select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basic-country-select-example',
  imports: [
    MatFormField,
    MatLabel,
    CountrySelectComponent,
    FormsModule
  ],
  templateUrl: './basic-country-select-example.component.html',
  styleUrl: './basic-country-select-example.component.scss'
})
export class BasicCountrySelectExampleComponent {
  country = model('US');
}
