import { Component } from '@angular/core';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CreditCardNumberMaskDirective } from '@elementar-ui/components/input-mask';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-credit-card-input-mask-example',
  imports: [
    MatPrefix,
    MatLabel,
    MatInput,
    MatFormField,
    MatIcon,
    CreditCardNumberMaskDirective
  ],
  templateUrl: './credit-card-input-mask-example.component.html',
  styleUrl: './credit-card-input-mask-example.component.scss'
})
export class CreditCardInputMaskExampleComponent {

}
