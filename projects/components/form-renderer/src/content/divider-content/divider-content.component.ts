import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'emr-divider-content',
  exportAs: 'emrDividerContent',
  imports: [
    MatDivider
  ],
  templateUrl: './divider-content.component.html',
  styleUrl: './divider-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerContentComponent {

}
