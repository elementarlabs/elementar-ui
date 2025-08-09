import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { PrimaryColorsExampleComponent } from '../_examples/primary-colors-example/primary-colors-example.component';
import {
  SecondaryColorsExampleComponent
} from '../_examples/secondary-colors-example/secondary-colors-example.component';
import { TertiaryColorsExampleComponent } from '../_examples/tertiary-colors-example/tertiary-colors-example.component';
import { ErrorColorsExampleComponent } from '../_examples/error-colors-example/error-colors-example.component';
import { SurfaceColorsExampleComponent } from '../_examples/surface-colors-example/surface-colors-example.component';
import { OutlineColorsExampleComponent } from '../_examples/outline-colors-example/outline-colors-example.component';
import { InverseColorsExampleComponent } from '../_examples/inverse-colors-example/inverse-colors-example.component';
import { NeutralColorsExampleComponent } from '../_examples/neutral-colors-example/neutral-colors-example.component';
import {
  NeutralVariantColorsExampleComponent
} from '../_examples/neutral-variant-colors-example/neutral-variant-colors-example.component';
import { OtherColorsExampleComponent } from '../_examples/other-colors-example/other-colors-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { GreenColorsExampleComponent } from '../_examples/green-colors-example/green-colors-example.component';
import { BlueColorsExampleComponent } from '../_examples/blue-colors-example/blue-colors-example.component';
import { OrangeColorsExampleComponent } from '../_examples/orange-colors-example/orange-colors-example.component';
import { RedColorsExampleComponent } from '../_examples/red-colors-example/red-colors-example.component';

@Component({
  selector: 'app-overview',
  imports: [
    PlaygroundComponent,
    PrimaryColorsExampleComponent,
    SecondaryColorsExampleComponent,
    TertiaryColorsExampleComponent,
    ErrorColorsExampleComponent,
    SurfaceColorsExampleComponent,
    OutlineColorsExampleComponent,
    InverseColorsExampleComponent,
    NeutralColorsExampleComponent,
    NeutralVariantColorsExampleComponent,
    OtherColorsExampleComponent,
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    GreenColorsExampleComponent,
    BlueColorsExampleComponent,
    OrangeColorsExampleComponent,
    RedColorsExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
