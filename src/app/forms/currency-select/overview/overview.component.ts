import { Component } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import {
  BasicCurrencySelectExampleComponent
} from '../_examples/basic-currency-select-example/basic-currency-select-example.component';
import {
  CurrencyWithCountryNameExampleComponent
} from '../_examples/currency-with-country-name-example/currency-with-country-name-example.component';

@Component({
  imports: [
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    PlaygroundComponent,
    BasicCurrencySelectExampleComponent,
    CurrencyWithCountryNameExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
