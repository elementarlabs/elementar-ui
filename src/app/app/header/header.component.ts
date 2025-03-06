import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { NotificationsPopoverComponent } from '../notifications-popover/notifications-popover.component';
import { AssistantSearchComponent } from '../assistant-search/assistant-search.component';
import { DicebearComponent } from '@elementar-ui/components/avatar';
import { SoundEffectDirective, ThemeManagerService } from '@elementar-ui/components/core';
import { PopoverTriggerForDirective } from '@elementar-ui/components/popover';
import { LayoutApiService } from '@elementar-ui/components/layout';
import { Notification } from '@elementar-ui/components/notifications';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatIconButton,
    MatBadge,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    DicebearComponent,
    MatDivider,
    MatButton,
    MatTooltip,
    AssistantSearchComponent,
    SoundEffectDirective,
    NotificationsPopoverComponent,
    PopoverTriggerForDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    'class': 'block w-full h-full'
  }
})
export class HeaderComponent {
  protected _themeManager = inject(ThemeManagerService);
  private _layoutApi = inject(LayoutApiService);

  @Input()
  sidebarHidden = false;

  notifications: Notification[] = [
    {
      actor: {
        id: 1,
        name: 'Justin Hansen',
        username: 'justin.hansen',
        avatarUrl: 'assets/avatars/2.svg'
      },
      notifier: {
        id: 2,
        name: 'Elma Johnson',
        username: 'elma.johnson',
        avatarUrl: 'assets/avatars/4.svg'
      },
      payload: {
        content: 'what did you say?'
      },
      type: 'mentionedInComment',
      createdAt: '1 hour ago'
    },
    {
      actor: {
        id: 3,
        name: 'Johnny Gladden',
        username: 'johnny.gladden',
        avatarUrl: 'assets/avatars/3.svg'
      },
      notifier: {
        id: 4,
        name: 'Angela Naylor',
        username: 'angela.naylor',
        avatarUrl: 'assets/avatars/7.svg'
      },
      payload: {
        folderName: 'My New Project'
      },
      type: 'inviteToEditFilesInFolder',
      createdAt: '2 hours ago'
    }
  ];

  toggleSidebar(): void {
    if (!this.sidebarHidden) {
      this._layoutApi.hideSidebar('root');
    } else {
      this._layoutApi.showSidebar('root');
    }

    this.sidebarHidden = !this.sidebarHidden;
  }
}
