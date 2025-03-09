import { Component, inject } from '@angular/core';
import { IconComponent } from '@elementar-ui/components/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { DicebearComponent } from '@elementar-ui/components/avatar';
import {
  TabPanelAsideComponent,
  TabPanelAsideContentDirective,
  TabPanelBodyComponent,
  TabPanelComponent,
  TabPanelCustomItemComponent,
  TabPanelFooterComponent,
  TabPanelHeaderComponent,
  TabPanelItemComponent,
  TabPanelNavComponent,
} from '@elementar-ui/components/tab-panel';
import {
  PanelBodyComponent,
  PanelComponent,
  PanelHeaderComponent,
} from '@elementar-ui/components/panel';
import { LayoutApiService } from '@elementar-ui/components/layout';

@Component({
  selector: 'app-sidebar',
  imports: [
    DicebearComponent,
    IconComponent,
    MatTab,
    MatTabGroup,
    MatTooltip,
    RouterLink,
    TabPanelItemComponent,
    TabPanelCustomItemComponent,
    TabPanelNavComponent,
    TabPanelBodyComponent,
    TabPanelHeaderComponent,
    TabPanelComponent,
    TabPanelAsideContentDirective,
    PanelHeaderComponent,
    PanelComponent,
    PanelBodyComponent,
    TabPanelAsideComponent,
    TabPanelAsideContentDirective,
    TabPanelFooterComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private layoutApiService = inject(LayoutApiService);
  likeOpenDrawer() {
    this.layoutApiService.showSidebar('drawer');
  }
}
