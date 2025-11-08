import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { v7 as uuid } from 'uuid';
import {
  SidebarBodyComponent,
  SidebarNavComponent,
  SidebarComponent as EmrSidebarComponent,
  SidebarNavGroupComponent,
  SidebarNavItemComponent,
  SidebarNavHeadingComponent,
  SidebarNavItemBadgeDirective,
  SidebarNavGroupToggleComponent,
  SidebarNavGroupMenuComponent,
  SidebarNavItemIconDirective,
  SidebarNavGroupToggleIconDirective
} from '@elementar-ui/components/sidebar';
import { OrderByPipe } from '@elementar-ui/components/core';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatIcon,
    RouterLink,
    EmrSidebarComponent,
    SidebarBodyComponent,
    SidebarNavComponent,
    SidebarNavGroupComponent,
    SidebarNavItemComponent,
    SidebarNavHeadingComponent,
    SidebarNavItemBadgeDirective,
    SidebarNavGroupToggleIconDirective,
    SidebarNavGroupToggleComponent,
    SidebarNavGroupMenuComponent,
    SidebarNavItemIconDirective,
    OrderByPipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: {
    'class': 'sidebar',
    '[class.compact]': 'compact'
  }
})
export class SidebarComponent implements OnInit {
  router = inject(Router);
  location = inject(Location);
  height: string | null = '200px';
  compact = false;

  navItems: any[] = [
    {
      type: 'link',
      name: 'Overview',
      key: 'overview',
      icon: 'local_fire_department',
      link: '/'
    },
    {
      type: 'link',
      name: 'Installation',
      key: 'installation',
      icon: 'install_desktop',
      link: '/installation'
    },
    {
      type: 'group',
      name: 'Theme',
      icon: 'tune',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Colors',
          link: '/theme/colors'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Typography',
          link: '/theme/typography'
        },
        {
          type: 'link',
          name: 'Customize Theme',
          key: 'customize',
          link: '/theme/customize-theme'
        },
      ]
    },
    {
      type: 'heading',
      name: 'Features'
    },
    {
      key: 'navigation',
      type: 'group',
      icon: 'menu',
      name: 'Navigation',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Navigation',
          link: '/navigation/navigation'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Breadcrumbs',
          link: '/navigation/breadcrumbs'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Tab Panel',
          link: '/navigation/tab-panel'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Rail Navigation',
          link: '/navigation/rail-nav'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Side Panel',
          link: '/navigation/side-panel'
        }
      ]
    },
    {
      type: 'group',
      icon: 'dns',
      name: 'Forms',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Autocomplete',
          link: '/forms/autocomplete'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Input',
          link: '/forms/input'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Buttons',
          link: '/forms/buttons'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Password Strength',
          link: '/forms/password-strength'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Slide Toggle',
          link: '/forms/slide-toggle'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Checkbox',
          link: '/forms/checkbox'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Radio',
          link: '/forms/radio'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Select',
          link: '/forms/select'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Segmented',
          link: '/forms/segmented'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Pin Input',
          link: '/forms/pin-input'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Number Input',
          link: '/forms/number-input'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Button Toggle',
          link: '/forms/button-toggle'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Phone Input',
          link: '/forms/phone-input'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Timezone',
          link: '/forms/timezone'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Country Select',
          link: '/forms/country'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Currency Select',
          link: '/forms/currency-select'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Date Format Select',
          link: '/forms/date-format-select'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Form Renderer',
          link: '/forms/form-renderer'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Inline Text Edit',
          link: '/forms/inline-text-edit'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Input Mask',
          link: '/forms/input-mask'
        },
        // {
        //   key: uuid(),
        //   type: 'link',
        //   name: 'Input Validator',
        //   link: '/forms/input-validator'
        // },
      ]
    },
    {
      type: 'group',
      icon: 'grid_view',
      name: 'Components',
      badge: 67,
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Action Required',
          link: '/components/action-required'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Alert',
          link: '/components/alert'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Bottom Sheet',
          link: '/components/bottom-sheet'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Card',
          link: '/components/card'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Card Overlay',
          link: '/components/card-overlay'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Carousel',
          link: '/components/carousel'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Cookie Popup',
          link: '/components/cookie-popup'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Crop',
          link: '/components/crop'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Code Highlighter',
          link: '/components/code-highlighter'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Dashboard',
          link: '/components/dashboard'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Incidents',
          link: '/components/incidents'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Expand',
          link: '/components/expand'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Content Fade',
          link: '/components/content-fade'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Icon',
          link: '/components/icon'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Emoji Picker',
          link: '/components/emoji-picker'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Badge',
          link: '/components/badge'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Avatar',
          link: '/components/avatar'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Block State',
          link: '/components/block-state'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Chips',
          link: '/components/chips'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Datepicker',
          link: '/components/datepicker'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Timepicker',
          link: '/components/timepicker'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Tabs',
          link: '/components/tabs'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Menu',
          link: '/components/menu'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Paginator',
          link: '/components/paginator'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Popover',
          link: '/components/popover'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Tooltip',
          link: '/components/tooltip'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Gauge',
          link: '/components/gauge'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Slider',
          link: '/components/slider'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Table',
          link: '/components/table'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Data View',
          link: '/components/dataview'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Timeline',
          link: '/components/timeline'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Dialog',
          link: '/components/dialog'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Upload',
          link: '/components/upload'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Panel',
          link: '/components/panel'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Resizable Container',
          link: '/components/resizable-container'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Snackbar',
          link: '/components/snackbar'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Command Bar',
          link: '/components/command-bar'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Color Picker',
          link: '/components/color-picker'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Brand Colors',
          link: '/components/brand-colors'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Divider',
          link: '/components/divider'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Skeleton',
          link: '/components/skeleton'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Filter Builder',
          link: '/components/filter-builder'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Expansion Panel',
          link: '/components/expansion-panel'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'List',
          link: '/components/list'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Progress Bar',
          link: '/components/progress-bar'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Progress Spinner',
          link: '/components/progress-spinner'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Stepper',
          link: '/components/stepper'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Toolbar',
          link: '/components/toolbar'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Tree',
          link: '/components/tree'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Layout',
          link: '/components/layout'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Suggestions',
          link: '/components/suggestions'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Announcement',
          link: '/components/announcement'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Marquee',
          link: '/components/marquee'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Sidebar',
          link: '/components/sidebar'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Confirm',
          link: '/components/confirm'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Thumbnail Maker',
          link: '/components/thumbnail-maker'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Image Viewer',
          link: '/components/image-viewer'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Image Resizer',
          link: '/components/image-resizer'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Comment Editor',
          link: '/components/comment-editor'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Text Editor',
          link: '/components/text-editor'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Screen Loader',
          link: '/components/screen-loader'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Kanban Board',
          link: '/components/kanban-board'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Sidenav',
          link: '/components/sidenav'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Drawer',
          link: '/components/drawer'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Comparison Slider',
          link: '/components/comparison-slider'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Signature Pad',
          link: '/components/signature-pad'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Notifications',
          link: '/components/notifications'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Block Loader',
          link: '/components/block-loader'
        },
      ]
    },
    {
      type: 'group',
      icon: 'leaderboard',
      name: 'Micro Charts',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Line Chart',
          link: '/micro-charts/line-chart'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Bar Chart',
          link: '/micro-charts/bar-chart'
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Pie Chart',
          link: '/micro-charts/pie-chart'
        }
      ]
    }
  ];
  navItemLinks: any[] = [];
  activeKey: null | string = null;

  ngOnInit() {
    this.navItems.forEach(navItem => {
      this.navItemLinks.push(navItem);

      if (navItem.children) {
        this.navItemLinks = this.navItemLinks.concat(navItem.children as any[]);
      }
    });
    this._activateLink();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this._activateLink();
      })
    ;
  }

  private _activateLink() {
    const activeLink = this.navItemLinks.find(
      navItem => {
        if (navItem.link === this.location.path()) {
          return true;
        }

        if (navItem.type === 'group') {
          return (this.location.path() !== '/' && this.location.path().includes(navItem.link as string));
        }

        return false;
      }
    );

    if (activeLink) {
      this.activeKey = activeLink.key;
    } else {
      this.activeKey = null;
    }
  }
}
