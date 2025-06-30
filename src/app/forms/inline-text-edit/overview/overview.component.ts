import { Component } from '@angular/core';
import { BasicRadioExampleComponent } from '../../radio/_examples/basic-radio-example/basic-radio-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { RadioCardExampleComponent } from '../../radio/_examples/radio-card-example/radio-card-example.component';
import {
  BasicInlineTextEditExampleComponent
} from '../_examples/basic-inline-text-edit-example/basic-inline-text-edit-example.component';

@Component({
  selector: 'app-overview',
  imports: [
    BasicRadioExampleComponent,
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    PlaygroundComponent,
    RadioCardExampleComponent,
    BasicInlineTextEditExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
