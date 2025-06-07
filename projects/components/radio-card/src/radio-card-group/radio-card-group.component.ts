import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'emr-radio-card-group',
  exportAs: 'emrRadioCardGroup',
  templateUrl: './radio-card-group.component.html',
  styleUrl: './radio-card-group.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioCardGroupComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'emr-radio-card-group',
    '[class.is-disabled]': 'disabled()'
  }
})
export class RadioCardGroupComponent implements ControlValueAccessor {
  readonly value = signal<any>(null);
  readonly disabled = signal<boolean>(false);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selectValue(value: any): void {
    if (this.disabled()) {
      return;
    }
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
