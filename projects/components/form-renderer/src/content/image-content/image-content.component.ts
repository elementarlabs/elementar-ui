import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ComponentConfig } from '../../models/form-config.model';

@Component({
  selector: 'emr-image-content',
  exportAs: 'emrImageContent',
  imports: [],
  templateUrl: './image-content.component.html',
  styleUrl: './image-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-image-content',
  }
})
export class ImageContentComponent {
  config = input.required<ComponentConfig>();
}
