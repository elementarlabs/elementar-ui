import { Component } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import {
  BasicCountrySelectExampleComponent
} from '../_examples/basic-country-select-example/basic-country-select-example.component';

@Component({
  selector: 'app-overview',
  imports: [
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    PlaygroundComponent,
    BasicCountrySelectExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
