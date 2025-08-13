import {
  booleanAttribute,
  Component,
  inject,
  input
} from '@angular/core';
import { EMR_SEGMENTED } from '../types';
import { SegmentedComponent } from '../segmented/segmented.component';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'emr-segmented-button,[emr-segmented-button]',
  exportAs: 'emrSegmentedButton',
  templateUrl: './segmented-button.component.html',
  styleUrl: './segmented-button.component.scss',
  hostDirectives: [
    MatRipple
  ],
  host: {
    'class': 'emr-segmented-button',
    '[class.icon-only]': 'iconOnly()',
    '[class.is-selected]': '_isSelected',
    '[class.is-disabled]': 'disabled() || null',
    '(click)': '_handleClick()',
  }
})
export class SegmentedButtonComponent {
  private _segmented = inject<SegmentedComponent>(EMR_SEGMENTED, { skipSelf: true });

  value = input.required<any>();
  disabled = input(false, {
    transform: booleanAttribute
  });
  iconOnly = input(false, {
    transform: booleanAttribute
  });

  get _isSelected(): boolean {
    return this._segmented.api.isSelected(this.value());
  }

  get api() {
    return {
      isSelected: () => this._isSelected
    }
  }

  protected _handleClick() {
    this._segmented.api.select(this.value());
  }
}
