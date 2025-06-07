import { Component, computed, inject, input } from '@angular/core';
import {
  RadioCardGroupComponent
} from '../radio-card-group/radio-card-group.component';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'emr-radio-card',
  imports: [
    MatRadioButton
  ],
  templateUrl: './radio-card.component.html',
  styleUrl: './radio-card.component.scss',
  host: {
    '[class.selected]': 'isSelected()',
    '[class.disabled]': 'parentGroup.disabled()',
    '(click)': 'selectCard()',
    'role': 'radio',
    '[attr.aria-checked]': 'isSelected()',
    '[attr.tabindex]': 'parentGroup.disabled() ? -1 : 0',
  },
})
export class RadioCardComponent {
  value = input.required<any>();
  protected parentGroup = inject(RadioCardGroupComponent);
  readonly isSelected = computed(() => this.parentGroup.value() === this.value());

  selectCard(): void {
    this.parentGroup.selectValue(this.value());
  }
}
