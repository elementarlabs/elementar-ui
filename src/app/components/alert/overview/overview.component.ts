import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicAlertExampleComponent } from '../_examples/basic-alert-example/basic-alert-example.component';
import { AlertVariantsExampleComponent } from '../_examples/alert-variants-example/alert-variants-example.component';
import { AlertWithIconExampleComponent } from '../_examples/alert-with-icon-example/alert-with-icon-example.component';
import {
  AlertWithTitleExampleComponent
} from '../_examples/alert-with-title-example/alert-with-title-example.component';
import { AlertActionsExampleComponent } from '../_examples/alert-actions-example/alert-actions-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatDivider } from '@angular/material/divider';
import { PageTitleDirective } from '@meta/page/page-title.directive';

@Component({
  imports: [
    PlaygroundComponent,
    BasicAlertExampleComponent,
    AlertVariantsExampleComponent,
    AlertWithIconExampleComponent,
    AlertWithTitleExampleComponent,
    AlertActionsExampleComponent,
    PageComponent,
    PageContentDirective,
    MatTabGroup,
    MatTab,
    MatDivider,
    PageTitleDirective
  ],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
