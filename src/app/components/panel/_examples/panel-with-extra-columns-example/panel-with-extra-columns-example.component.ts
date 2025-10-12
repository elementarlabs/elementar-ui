import { Component, signal } from '@angular/core';
import { OverlayScrollbarComponent } from '@elementar-ui/components/overlay-scrollbar';
import {
  PanelAsideComponent,
  PanelBodyComponent,
  PanelComponent,
  PanelFooterComponent,
  PanelHeaderComponent, PanelSidebarComponent
} from '@elementar-ui/components/panel';

@Component({
  selector: 'app-panel-with-extra-columns-example',
  imports: [
    OverlayScrollbarComponent,
    PanelBodyComponent,
    PanelComponent,
    PanelFooterComponent,
    PanelHeaderComponent,
    PanelSidebarComponent,
    PanelAsideComponent
  ],
  templateUrl: './panel-with-extra-columns-example.component.html',
  styleUrl: './panel-with-extra-columns-example.component.scss'
})
export class PanelWithExtraColumnsExampleComponent {
  width = signal(200);

  setSidebarLongWidth() {
    this.width.set(400);
  }
}
