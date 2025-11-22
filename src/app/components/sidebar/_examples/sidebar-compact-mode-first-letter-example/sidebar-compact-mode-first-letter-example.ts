import { Component } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  SidebarBodyComponent,
  SidebarCompactViewModeDirective,
  SidebarComponent, SidebarFooterComponent, SidebarFullViewModeDirective, SidebarHeaderComponent, SidebarNavComponent,
  SidebarNavDividerComponent, SidebarNavGroupComponent, SidebarNavGroupMenuComponent, SidebarNavGroupToggleComponent,
  SidebarNavGroupToggleIconDirective, SidebarNavHeadingComponent, SidebarNavItemComponent, SidebarNavItemIconDirective
} from '@elementar-ui/components/sidebar';
import { v7 as uuid } from 'uuid';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-compact-mode-first-letter-example',
  imports: [
    MatIcon,
    MatSlideToggle,
    SidebarBodyComponent,
    SidebarCompactViewModeDirective,
    SidebarComponent,
    SidebarFooterComponent,
    SidebarFullViewModeDirective,
    SidebarHeaderComponent,
    SidebarNavComponent,
    SidebarNavDividerComponent,
    SidebarNavGroupComponent,
    SidebarNavGroupMenuComponent,
    SidebarNavGroupToggleComponent,
    SidebarNavGroupToggleIconDirective,
    SidebarNavHeadingComponent,
    SidebarNavItemComponent,
    SidebarNavItemIconDirective,
    FormsModule
  ],
  templateUrl: './sidebar-compact-mode-first-letter-example.html',
  styleUrl: './sidebar-compact-mode-first-letter-example.scss',
})
export class SidebarCompactModeFirstLetterExample {
  compact = true;
  navItems: any[] = [
    {
      key: 'home',
      type: 'item',
      label: 'Home',
      icon: 'dashboard',
    },
    {
      key: 'forms',
      type: 'item',
      icon: 'dns',
      label: 'Forms'
    },
    {
      key: 'account',
      type: 'item',
      label: 'Account'
    },
    {
      type: 'divider',
    },
    {
      type: 'group',
      label: 'Nested Menu',
      // icon: 'tune',
      children: [
        {
          key: uuid(),
          type: 'item',
          label: 'Nested Item 1'
        },
        {
          key: uuid(),
          type: 'item',
          label: 'Nested Item 2'
        }
      ]
    },
    {
      type: 'heading',
      label: 'Overview'
    },
    {
      key: 'item1',
      type: 'item',
      label: 'Item 1'
    },
    {
      key: 'item2',
      type: 'item',
      label: 'Item 2'
    },
  ];

  trancate(label: string): string {
    return label.slice(0, 3);
  }
}
