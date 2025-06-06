import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FileComponent, FileControlComponent, FileListComponent } from '@elementar-ui/components/upload';

export interface File {
  name: string;
  state: 'uploaded' | 'uploading' | 'error';
  processing?: boolean;
  errorMessage?: string;
  remainingTime?: string;
  size?: string;
  progress?: number;
  type: string;
}

@Component({
  selector: 'app-file-list-example',
  imports: [
    MatIcon,
    FileComponent,
    FileListComponent,
    FileControlComponent
  ],
  templateUrl: './file-list-example.component.html',
  styleUrl: './file-list-example.component.scss'
})
export class FileListExampleComponent {
  fileList: File[] = [
    {
      name: 'Annual Report.docx',
      state: 'uploaded',
      processing: false,
      type: 'doc'
    },
    {
      name: 'Workflow.pdf',
      state: 'uploading',
      processing: false,
      remainingTime: '(remaining time: 00:2:01)',
      size: '11MB',
      progress: 60,
      type: 'pdf'
    },
    {
      name: 'Financials.xlsx',
      state: 'error',
      errorMessage: 'An error occurred',
      type: 'xls'
    }
  ];
}
