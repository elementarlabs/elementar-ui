import { Component } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { CreditCardExpiryDateMaskDirective } from '@elementar-ui/components/input-mask';

@Component({
  selector: 'app-credit-card-expiry-input-mask-example',
  imports: [
    MatInput,
    CreditCardExpiryDateMaskDirective,
    MatLabel,
    MatFormField
  ],
  templateUrl: './credit-card-expiry-input-mask-example.component.html',
  styleUrl: './credit-card-expiry-input-mask-example.component.scss'
})
export class CreditCardExpiryInputMaskExampleComponent {

}
