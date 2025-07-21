import { Component, model } from '@angular/core';
import { CurrencySelectComponent } from '@elementar-ui/components/currency-select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-with-country-name-example',
  imports: [
    CurrencySelectComponent,
    MatFormField,
    MatLabel,
    FormsModule
  ],
  templateUrl: './currency-with-country-name-example.component.html',
  styleUrl: './currency-with-country-name-example.component.scss'
})
export class CurrencyWithCountryNameExampleComponent {
  currency = model('usd');
}
