import { Component } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import {
  BasicBrandColorsExampleComponent
} from '../_examples/basic-brand-colors-example/basic-brand-colors-example.component';
import {
  BrandColorsCustomColorsExampleComponent
} from '../_examples/brand-colors-custom-colors-example/brand-colors-custom-colors-example.component';
import {
  BrandColorsAsFormControlExampleComponent
} from '../_examples/brand-colors-as-form-control-example/brand-colors-as-form-control-example.component';
import {
  BrandColorsDisabledExampleComponent
} from '../_examples/brand-colors-disabled-example/brand-colors-disabled-example.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import {
  BrandColorsWithGradientExampleComponent
} from '../_examples/brand-colors-with-gradient-example/brand-colors-with-gradient-example.component';

@Component({
  imports: [
    PageComponent,
    PageContentDirective,
    PlaygroundComponent,
    BasicBrandColorsExampleComponent,
    BrandColorsCustomColorsExampleComponent,
    BrandColorsAsFormControlExampleComponent,
    BrandColorsDisabledExampleComponent,
    MatTab,
    MatTabGroup,
    PageTitleDirective,
    BrandColorsWithGradientExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
