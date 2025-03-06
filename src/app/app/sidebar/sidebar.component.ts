import { Component } from '@angular/core';
import { HorizontalDividerComponent } from '@elementar-ui/components/divider';
import { IconComponent } from '@elementar-ui/components/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent, DicebearComponent } from '@elementar-ui/components/avatar';
import {
  TabPanelAsideComponent,
  TabPanelAsideContentDirective,
  TabPanelBodyComponent, TabPanelComponent,
  TabPanelCustomItemComponent, TabPanelFooterComponent, TabPanelHeaderComponent,
  TabPanelItemComponent,
  TabPanelNavComponent
} from '@elementar-ui/components/tab-panel';
import { PanelBodyComponent, PanelComponent, PanelHeaderComponent } from '@elementar-ui/components/panel';

@Component({
  selector: 'app-sidebar',
  imports: [
    DicebearComponent,
    HorizontalDividerComponent,
    IconComponent,
    MatTab,
    MatTabGroup,
    MatTooltip,
    RouterLink,
    AvatarComponent,
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
    TabPanelFooterComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
