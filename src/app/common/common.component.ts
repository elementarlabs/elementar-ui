import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@app/sidebar/sidebar.component';
import {
  LayoutBodyComponent,
  LayoutComponent,
  LayoutSidebarComponent,
  LayoutTopbarComponent,
} from '@elementar-ui/components/layout';
import { AnnouncementGlobalComponent } from '@elementar-ui/components/announcement';
import { IncidentsContainerComponent } from '@elementar-ui/components/incidents';

@Component({
  imports: [
    RouterOutlet,
    SidebarComponent,
    LayoutComponent,
    LayoutBodyComponent,
    LayoutSidebarComponent,
    LayoutTopbarComponent,
    IncidentsContainerComponent,
    AnnouncementGlobalComponent
  ],
  templateUrl: './common.component.html'
})
export class CommonComponent {
}
