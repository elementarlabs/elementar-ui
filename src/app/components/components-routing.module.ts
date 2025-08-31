import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'cookie-popup',
    loadChildren: () => import('./cookie-popup/cookie-popup.module').then(m => m.CookiePopupModule)
  },
  {
    path: 'action-required',
    loadChildren: () => import('./action-required/action-required.module').then(m => m.ActionRequiredModule)
  },
  {
    path: 'avatar',
    loadChildren: () => import('./avatar/avatar.module').then(m => m.AvatarModule)
  },
  {
    path: 'timeline',
    loadChildren: () => import('./timeline/timeline.module').then(m => m.TimelineModule)
  },
  {
    path: 'badge',
    loadChildren: () => import('./badge/badge.module').then(m => m.BadgeModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'sidebar',
    loadChildren: () => import('./sidebar/sidebar.module').then(m => m.SidebarModule)
  },
  {
    path: 'bottom-sheet',
    loadChildren: () => import('./bottom-sheet/bottom-sheet.module').then(m => m.BottomSheetModule)
  },
  {
    path: 'card',
    loadChildren: () => import('./card/card.module').then(m => m.CardModule)
  },
  {
    path: 'card-overlay',
    loadChildren: () => import('./card-overlay/card-overlay.module').then(m => m.CardOverlayModule)
  },
  {
    path: 'carousel',
    loadChildren: () => import('./carousel/carousel.module').then(m => m.CarouselModule)
  },
  {
    path: 'chips',
    loadChildren: () => import('./chips/chips.module').then(m => m.ChipsModule)
  },
  {
    path: 'chips',
    loadChildren: () => import('./chips/chips.module').then(m => m.ChipsModule)
  },
  {
    path: 'emoji-picker',
    loadChildren: () => import('./emoji-picker/emoji-picker.module').then(m => m.EmojiPickerModule)
  },
  {
    path: 'datepicker',
    loadChildren: () => import('./datepicker/datepicker.module').then(m => m.DatepickerModule)
  },
  {
    path: 'timepicker',
    loadChildren: () => import('./timepicker/timepicker.module').then(m => m.TimepickerModule)
  },
  {
    path: 'icon',
    loadChildren: () => import('./icon/icon.module').then(m => m.IconModule)
  },
  {
    path: 'dialog',
    loadChildren: () => import('./dialog/dialog.module').then(m => m.DialogModule)
  },
  {
    path: 'divider',
    loadChildren: () => import('./divider/divider.module').then(m => m.DividerModule)
  },
  {
    path: 'content-fade',
    loadChildren: () => import('./content-fade/content-fade.module').then(m => m.ContentFadeModule)
  },
  {
    path: 'expansion-panel',
    loadChildren: () => import('./expansion-panel/expansion-panel.module').then(m => m.ExpansionPanelModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)
  },
  {
    path: 'paginator',
    loadChildren: () => import('./paginator/paginator.module').then(m => m.PaginatorModule)
  },
  {
    path: 'progress-bar',
    loadChildren: () => import('./progress-bar/progress-bar.module').then(m => m.ProgressBarModule)
  },
  {
    path: 'resizable-container',
    loadChildren: () => import('./resizable-container/resizable-container.module').then(m => m.ResizableContainerModule)
  },
  {
    path: 'gauge',
    loadChildren: () => import('./gauge/gauge.module').then(m => m.GaugeModule)
  },
  {
    path: 'progress-spinner',
    loadChildren: () => import('./progress-spinner/progress-spinner.module').then(m => m.ProgressSpinnerModule)
  },
  {
    path: 'slider',
    loadChildren: () => import('./slider/slider.module').then(m => m.SliderModule)
  },
  {
    path: 'thumbnail-maker',
    loadChildren: () => import('./thumbnail-maker/thumbnail-maker.module').then(m => m.ThumbnailMakerModule)
  },
  {
    path: 'expand',
    loadChildren: () => import('./expand/expand.module').then(m => m.ExpandModule)
  },
  {
    path: 'snackbar',
    loadChildren: () => import('./snackbar/snackbar.module').then(m => m.SnackbarModule)
  },
  {
    path: 'comment-editor',
    loadChildren: () => import('./comment-editor/comment-editor.module').then(m => m.CommentEditorModule)
  },
  {
    path: 'table',
    loadChildren: () => import('./table/table.module').then(m => m.TableModule)
  },
  {
    path: 'dataview',
    loadChildren: () => import('./dataview/dataview.module').then(m => m.DataviewModule)
  },
  {
    path: 'stepper',
    loadChildren: () => import('./stepper/stepper.module').then(m => m.StepperModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule)
  },
  {
    path: 'toolbar',
    loadChildren: () => import('./toolbar/toolbar.module').then(m => m.ToolbarModule)
  },
  {
    path: 'tooltip',
    loadChildren: () => import('./tooltip/tooltip.module').then(m => m.TooltipModule)
  },
  {
    path: 'tree',
    loadChildren: () => import('./tree/tree.module').then(m => m.TreeModule)
  },
  {
    path: 'skeleton',
    loadChildren: () => import('./skeleton/skeleton.module').then(m => m.SkeletonModule)
  },
  {
    path: 'alert',
    loadChildren: () => import('./alert/alert.module').then(m => m.AlertModule)
  },
  {
    path: 'popover',
    loadChildren: () => import('./popover/popover.module').then(m => m.PopoverModule)
  },
  {
    path: 'color-picker',
    loadChildren: () => import('./color-picker/color-picker.module').then(m => m.ColorPickerModule)
  },
  {
    path: 'brand-colors',
    loadChildren: () => import('./brand-colors/brand-colors.module').then(m => m.BrandColorsModule)
  },
  {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule)
  },
  {
    path: 'command-bar',
    loadChildren: () => import('./command-bar/command-bar.module').then(m => m.CommandBarModule)
  },
  {
    path: 'filter-builder',
    loadChildren: () => import('./filter-builder/filter-builder.module').then(m => m.FilterBuilderModule)
  },
  {
    path: 'panel',
    loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule)
  },
  {
    path: 'incidents',
    loadChildren: () => import('./incidents/incidents.module').then(m => m.IncidentsModule)
  },
  {
    path: 'layout',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'suggestions',
    loadChildren: () => import('./suggestions/suggestions.module').then(m => m.SuggestionsModule)
  },
  {
    path: 'announcement',
    loadChildren: () => import('./announcement/announcement.module').then(m => m.AnnouncementModule)
  },
  {
    path: 'block-state',
    loadChildren: () => import('./block-state/block-state.module').then(m => m.BlockStateModule)
  },
  {
    path: 'confirm',
    loadChildren: () => import('./confirm/confirm.module').then(m => m.ConfirmModule)
  },
  {
    path: 'image-viewer',
    loadChildren: () => import('./image-viewer/image-viewer.module').then(m => m.ImageViewerModule)
  },
  {
    path: 'image-resizer',
    loadChildren: () => import('./image-resizer/image-resizer.module').then(m => m.ImageResizerModule)
  },
  {
    path: 'marquee',
    loadChildren: () => import('./marquee/marquee.module').then(m => m.MarqueeModule)
  },
  {
    path: 'text-editor',
    loadChildren: () => import('./text-editor/text-editor.module').then(m => m.TextEditorModule)
  },
  {
    path: 'screen-loader',
    loadChildren: () => import('./screen-loader/screen-loader.module').then(m => m.ScreenLoaderModule)
  },
  {
    path: 'kanban-board',
    loadChildren: () => import('./kanban-board/kanban-board.module').then(m => m.KanbanBoardModule)
  },
  {
    path: 'sidenav',
    loadChildren: () => import('./sidenav/sidenav.module').then(m => m.SidenavModule)
  },
  {
    path: 'drawer',
    loadChildren: () => import('./drawer/drawer.module').then(m => m.DrawerModule)
  },
  {
    path: 'comparison-slider',
    loadChildren: () => import('./comparison-slider/comparison-slider.module').then(m => m.ComparisonSliderModule)
  },
  {
    path: 'signature-pad',
    loadChildren: () => import('./signature-pad/signature-pad.module').then(m => m.SignaturePadModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule)
  },
  {
    path: 'block-loader',
    loadChildren: () => import('./block-loader/block-loader.module').then(m => m.BlockLoaderModule)
  },
  {
    path: 'code-highlighter',
    loadChildren: () => import('./code-highlighter/code-highlighter.module').then(m => m.CodeHighlighterModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
