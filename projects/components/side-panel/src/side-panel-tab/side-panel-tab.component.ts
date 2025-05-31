import { Component, input, TemplateRef, ViewChild } from '@angular/core';


@Component({
  selector: 'emr-side-panel-tab',
  exportAs: 'emrSidePanelTab',
  standalone: true,
  templateUrl: './side-panel-tab.component.html',
  styleUrl: './side-panel-tab.component.scss',
  host: {
    'class': 'emr-side-panel-tab',
  },
})
export class SidePanelTabComponent {
  tabId = input.required<string>();
  label = input.required<string>();
  icon = input<string | TemplateRef<any> | undefined>();

  @ViewChild('contentTemplate', { read: TemplateRef, static: true })
  content!: TemplateRef<any>;
}
