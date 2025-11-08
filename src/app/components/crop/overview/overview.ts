import { Component, model } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicImageCropExample } from '../_examples/basic-image-crop-example/basic-image-crop-example';
import { Crop } from '@elementar-ui/components/crop';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  imports: [
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    Crop,
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  cropShape = model<'rectangle' | 'circle'>('rectangle');
}
