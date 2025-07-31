import { Component } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import {
  CreditCardInputMaskExampleComponent
} from '../_examples/credit-card-input-mask-example/credit-card-input-mask-example.component';
import {
  CreditCardExpiryInputMaskExampleComponent
} from '../_examples/credit-card-expiry-input-mask-example/credit-card-expiry-input-mask-example.component';
import {
  CreditCardCvvInputMaskExampleComponent
} from '../_examples/credit-card-cvv-input-mask-example/credit-card-cvv-input-mask-example.component';

@Component({
  imports: [
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    PlaygroundComponent,
    CreditCardInputMaskExampleComponent,
    CreditCardExpiryInputMaskExampleComponent,
    CreditCardCvvInputMaskExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
