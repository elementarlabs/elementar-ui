import { Component } from '@angular/core';
import { BasicSidebarExampleComponent } from '../_examples/basic-sidebar-example/basic-sidebar-example.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { PageComponent } from '@meta/page/page.component';
import { SidebarCompactExampleComponent } from '../_examples/sidebar-compact-example/sidebar-compact-example.component';
import {
  SidebarWithCustomIconsExampleComponent
} from '../_examples/sidebar-with-custom-icons-example/sidebar-with-custom-icons-example.component';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import {
  SidebarCompactModeFirstLetterExample
} from '../_examples/sidebar-compact-mode-first-letter-example/sidebar-compact-mode-first-letter-example';

@Component({
  imports: [
    BasicSidebarExampleComponent,
    PageContentDirective,
    PlaygroundComponent,
    PageComponent,
    SidebarCompactExampleComponent,
    SidebarWithCustomIconsExampleComponent,
    PageTitleDirective,
    SidebarCompactModeFirstLetterExample
  ],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
