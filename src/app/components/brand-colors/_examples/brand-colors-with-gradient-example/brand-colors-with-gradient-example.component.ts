import { Component, signal } from '@angular/core';
import { BrandColorsComponent } from '@elementar-ui/components/brand-colors';

@Component({
  selector: 'app-brand-colors-with-gradient-example',
  imports: [
    BrandColorsComponent
  ],
  templateUrl: './brand-colors-with-gradient-example.component.html',
  styleUrl: './brand-colors-with-gradient-example.component.scss'
})
export class BrandColorsWithGradientExampleComponent {
  colors = signal([
    '#acffee', '#b5e2fa', '#d7ceff', '#eec7fd', '#ffb7e0',
    '#ffddc1', '#fdedbb', '#ffcdcd', '#beeeff'
  ]);
  selectedColor = signal('');

  onColorChange(color: string): void {
    this.selectedColor.set(color);
  }
}
