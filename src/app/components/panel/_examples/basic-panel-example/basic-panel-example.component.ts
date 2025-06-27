import { Component } from '@angular/core';
import {
  PanelBodyComponent,
  PanelComponent,
  PanelFooterComponent,
  PanelHeaderComponent,
} from '@elementar-ui/components/panel';
import { OverlayScrollbarComponent } from '@elementar-ui/components/overlay-scrollbar';

@Component({
  selector: 'app-basic-panel-example',
  imports: [
    PanelBodyComponent,
    PanelFooterComponent,
    PanelHeaderComponent,
    PanelComponent,
    OverlayScrollbarComponent
  ],
  templateUrl: './basic-panel-example.component.html',
  styleUrl: './basic-panel-example.component.scss'
})
export class BasicPanelExampleComponent {

}
