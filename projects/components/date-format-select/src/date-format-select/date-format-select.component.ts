import {
  Component,
  inject,
  input,
  OnDestroy,
  signal, viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type DateFormat = {
  value: string;
  name: string;
};

@Component({
  selector: 'emr-date-format-select',
  exportAs: 'emrDateFormatSelect',
  imports: [
    MatSelectModule
  ],
  templateUrl: './date-format-select.component.html',
  styleUrl: './date-format-select.component.scss',
  providers: [{
    provide: MatFormFieldControl,
    useExisting: DateFormatSelectComponent
  }],
  host: {
    '[id]': 'id',
    'role': 'combobox',
    '[attr.required]': 'required || null',
  },
})
export class DateFormatSelectComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnDestroy {
  private static nextId = 0;

  readonly matSelect = viewChild.required(MatSelect);

  readonly dateFormats = input<DateFormat[]>([
    { value: 'MM/dd/yyyy', name: 'MM/DD/YYYY' },
    { value: 'dd.MM.yyyy', name: 'DD.MM.YYYY' },
    { value: 'yyyy-MM-dd', name: 'YYYY-MM-DD' },
  ]);

  private readonly _value = signal<string | null>(null);
  private readonly _focused = signal(false);
  readonly _describedBy = signal('');

  readonly stateChanges = new Subject<void>();
  readonly id = `date-format-input-${DateFormatSelectComponent.nextId++}`;
  readonly controlType = 'date-format-input';
  readonly autofilled = false;

  get focused(): boolean {
    return this._focused();
  }

  get empty(): boolean {
    return !this._value();
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get errorState(): boolean {
    return this.ngControl?.invalid === true && this.ngControl.touched === true;
  }

  get value(): string | null {
    return this._value();
  }
  set value(val: string | null) {
    this._value.set(val);
    this.stateChanges.next();
  }

  readonly ngControl = inject(NgControl, { self: true, optional: true });
  readonly placeholderInput = input<string>('', { alias: 'placeholder' });

  get placeholder(): string {
    return this.placeholderInput();
  }

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  private _required = false;

  get required(): boolean {
    return this._required;
  }
  set required(value: boolean | string) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _disabled = false;

  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean | string) {
    this._disabled = coerceBooleanProperty(value);
    this.matSelect().setDisabledState(this._disabled);
    this.stateChanges.next();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  onFocus(): void {
    if (!this.focused) {
      this._focused.set(true);
      this.stateChanges.next();
    }
  }

  onBlur(): void {
    this._focused.set(false);
    this.onTouched();
    this.stateChanges.next();
  }

  onSelectionChange(event: MatSelectChange): void {
    this.value = event.value;
    this.onChange(this.value);
  }

  setDescribedByIds(ids: string[]): void {
    this._describedBy.set(ids.join(' '));
  }

  onContainerClick(): void {
    if (!this.disabled) {
      this.matSelect().open();
    }
  }

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
