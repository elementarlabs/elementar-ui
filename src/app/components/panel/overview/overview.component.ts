import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicPanelExampleComponent } from '../_examples/basic-panel-example/basic-panel-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { MatDivider } from '@angular/material/divider';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import {
  PanelWithExtraColumnsExampleComponent
} from '../_examples/panel-with-extra-columns-example/panel-with-extra-columns-example.component';

@Component({
    selector: 'app-overview',
  imports: [
    PlaygroundComponent,
    BasicPanelExampleComponent,
    PageComponent,
    PageContentDirective,
    MatDivider,
    PageTitleDirective,
    PanelWithExtraColumnsExampleComponent
  ],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
