import { Component, model } from '@angular/core';
import { CurrencySelectComponent } from '@elementar-ui/components/currency-select';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-basic-currency-select-example',
  imports: [
    CurrencySelectComponent,
    FormsModule,
    MatFormField,
    MatLabel
  ],
  templateUrl: './basic-currency-select-example.component.html',
  styleUrl: './basic-currency-select-example.component.scss'
})
export class BasicCurrencySelectExampleComponent {
  currency = model('USD');
}
