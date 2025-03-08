import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  DoCheck,
  ElementRef,
  inject, Input, input,
  numberAttribute,
  OnDestroy, Optional,
  output, Self,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { DecreaseControlDirective } from '../decrease-control.directive';
import { IncreaseControlDirective } from '../increase-control.directive';
// import { NumberInputPrefixDirective } from '../number-input-prefix.directive';
// import { NumberInputSuffixDirective } from '../number-input-suffix.directive';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { MatRipple } from '@angular/material/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'emr-number-input',
  exportAs: 'emrNumberInput',
  imports: [
    MatRipple,
    NgTemplateOutlet
  ],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: NumberInputComponent
    }
  ],
  host: {
    'class': 'emr-number-input',
    '[class.floating]': 'shouldLabelFloat',
    'id': 'id'
  }
})
export class NumberInputComponent implements MatFormFieldControl<any>, ControlValueAccessor, OnDestroy, DoCheck {
  private _parentForm = inject(NgForm, {
    optional: true,
  });
  private _parentFormGroup = inject(FormGroupDirective, {
    optional: true,
  });
  private _elementRef = inject(ElementRef);
  readonly disableAutomaticLabeling: boolean;
  readonly placeholder: string;

  private _input = viewChild.required<ElementRef>('input');
  readonly _decreaseControlRef = contentChild<DecreaseControlDirective>(DecreaseControlDirective);
  readonly _increaseControlRef = contentChild<IncreaseControlDirective>(IncreaseControlDirective);
  // readonly _prefixRef = contentChild<NumberInputPrefixDirective>(NumberInputPrefixDirective);
  // readonly _suffixRef = contentChild<NumberInputSuffixDirective>(NumberInputSuffixDirective);

  min = input(undefined, {
    transform: numberAttribute
  });
  max = input(undefined, {
    transform: numberAttribute
  });
  step = input(1, {
    transform: numberAttribute
  });
  readonly = input(false, {
    transform: booleanAttribute
  });

  @Input()
  set disabled(disabled: any) {
    this._disabled = coerceBooleanProperty(disabled);
    this.stateChanges.next();
  }
  get disabled() {
    return this._disabled;
  }
  private _disabled = false;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(req: BooleanInput) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  readonly valueChange = output<number|undefined>();

  static nextId = 0;
  private _value: number | undefined;
  controlType?: string | undefined;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  errorState: boolean = false;

  get id(): string {
    return `emr-number-input${NumberInputComponent.nextId++}`;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get empty(): boolean {
    if (this._value === 0) {
      return false;
    }

    return typeof this._value !== 'number';
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
  ) {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  set value(value: number | undefined) {
    this._value = value;
    this.stateChanges.next();
  }
  get value(): number | undefined {
    return this._value;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  protected get _decreaseControlTemplateRef() {
    return this._decreaseControlRef()?.templateRef as TemplateRef<any>;
  }

  protected get _increaseControlTemplateRef() {
    return this._increaseControlRef()?.templateRef as TemplateRef<any>;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = coerceBooleanProperty(isDisabled);
  }

  writeValue(value: any): void {
    this._input().nativeElement.value = value;
    this.value = value;
  }

  decrease(event: MouseEvent, input: HTMLInputElement) {
    event.preventDefault();
    event.stopPropagation();
    let value = +input.value;
    value -= this.step();
    input.value = value.toString();
    this._emitEvent();
  }

  increase(event: MouseEvent, input: HTMLInputElement) {
    event.preventDefault();
    event.stopPropagation();
    let value = +input.value;
    value += this.step();
    input.value = value.toString();
    this._emitEvent();
  }

  isDecreaseDisabled() {
    const value = this._input().nativeElement.value;

    if (typeof this.min() === 'undefined') {
      return false;
    }

    // @ts-ignore
    return (typeof this.min() === 'number' && +value <= this.min()) || this.readonly() || this.disabled;
  }

  isIncreaseDisabled() {
    const value = this._input().nativeElement.value;

    if (typeof this.max() === 'undefined') {
      return false;
    }

    // @ts-ignore
    return ((typeof this.min() === 'number' && value) && +value >= this.max()) || this.readonly() || this.disabled;
  }

  inputChange(event: any) {
    this._value = this._input().nativeElement.value ? +this._input().nativeElement.value : undefined;
    this._emitEvent();
  }

  private _emitEvent() {
    const value = this._input().nativeElement.value ? +this._input().nativeElement.value : undefined;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
    this.updateErrorState();
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this._elementRef.nativeElement.querySelector('input').focus();
    }
  }

  private updateErrorState() {
    const parent = this._parentFormGroup || this._parentForm;
    const oldState = this.errorState;
    let newState = !!(this.ngControl?.invalid) && this.touched;

    if (parent) {
      newState = !!(this.ngControl?.invalid) && (this.touched || parent.submitted);
    }

    if (oldState !== newState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }
}
