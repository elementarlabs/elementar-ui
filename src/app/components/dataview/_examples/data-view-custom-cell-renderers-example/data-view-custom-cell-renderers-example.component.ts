import { Component, inject, model, OnInit } from '@angular/core';
import {
  cellRenderer,
  DataViewCellRenderer,
  DataViewColumnDef,
  DataViewComponent
} from '@elementar-ui/components/data-view';
import { HttpClient } from '@angular/common/http';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

export interface User {
  id: string | number;
  username: string;
  name: string;
  email: string;
  enabled: boolean | null;
  website: string;
  avatarUrl: string;
  createdAt: string;
}

@Component({
  selector: 'app-data-view-custom-cell-renderers-example',
  imports: [
    DataViewComponent,
    MatRadioButton,
    MatRadioGroup,
    FormsModule
  ],
  templateUrl: './data-view-custom-cell-renderers-example.component.html',
  styleUrl: './data-view-custom-cell-renderers-example.component.scss'
})
export class DataViewCustomCellRenderersExampleComponent implements OnInit {
  private _httpClient = inject(HttpClient);

  variant = model<'list' | 'table'>('list');
  columnDefs: DataViewColumnDef[] = [
    {
      name: 'Id',
      dataField: 'id',
      visible: false
    },
    {
      name: 'User',
      dataField: 'id',
      dataRenderer: 'user',
      visible: true,
      width: '300px',
      valueGetter: value => {
        return value.name;
      }
    },
    {
      name: 'Enabled',
      dataField: 'enabled',
      dataRenderer: 'enabled',
      visible: true
    },
    {
      name: 'Created At',
      dataField: 'createdAt',
      dataRenderer: 'date',
      visible: true
    },
    {
      name: 'Website',
      dataField: 'website',
      dataRenderer: 'link',
      visible: true
    }
  ];
  data: User[] = []
  cellRenderers: DataViewCellRenderer[] = [
    cellRenderer('user', () => import('../../_prebuilt-renderers/user-cell/user-cell.renderer').then(c => c.UserCellRenderer)),
    cellRenderer('date', () => import('../../_prebuilt-renderers/date-cell/date-cell.renderer').then(c => c.DateCellRenderer)),
    cellRenderer('enabled', () => import('../../_prebuilt-renderers/enabled-cell/enabled-cell.renderer').then(c => c.EnabledCellRenderer)),
    cellRenderer('link', () => import('../../_prebuilt-renderers/link-cell/link-cell.renderer').then(c => c.LinkCellRenderer)),
  ];

  ngOnInit() {
    this._httpClient
      .get<User[]>('/assets/mockdata/data-view-custom-cell-renderers.json')
      .subscribe(data => {
        this.data = data;
      })
    ;
  }
}
