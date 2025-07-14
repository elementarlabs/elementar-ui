import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicMenuExampleComponent } from '../_examples/basic-menu-example/basic-menu-example.component';
import { MenuWithIconsExampleComponent } from '../_examples/menu-with-icons-example/menu-with-icons-example.component';
import { NestedMenuExampleComponent } from '../_examples/nested-menu-example/nested-menu-example.component';
import {
  MenuPositioningExampleComponent
} from '../_examples/menu-positioning-example/menu-positioning-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { ContextMenuExampleComponent } from '../_examples/context-menu-example/context-menu-example.component';

@Component({
  selector: 'app-overview',
  imports: [
    PlaygroundComponent,
    BasicMenuExampleComponent,
    MenuWithIconsExampleComponent,
    NestedMenuExampleComponent,
    MenuPositioningExampleComponent,
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    ContextMenuExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
