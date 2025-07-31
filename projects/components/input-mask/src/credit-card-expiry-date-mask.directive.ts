import { Directive, ElementRef, inject, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const formatOnInput = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').substring(0, 4);
  let month = cleaned.substring(0, 2);
  const year = cleaned.substring(2, 4);

  if (month.length === 2) {
    const monthInt = parseInt(month, 10);
    if (monthInt > 12) month = '12';
    if (monthInt === 0) month = '01';
  }

  return cleaned.length > 2 ? `${month}/${year}` : month;
};

const formatOnBlur = (value: string): string => {
  if (!value) return '';
  const parts = value.split('/');
  const month = parts[0] || '';
  let year = parts[1] || '';

  if (year && year.length === 1) {
    year = `0${year}`;
  }

  return year ? `${month}/${year}` : month;
};


@Directive({
  selector: '[emrCreditCardExpiryDateMask]',
  exportAs: 'emrCreditCardExpiryDateMask',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditCardExpiryDateMaskDirective),
      multi: true,
    },
  ],
  host: {
    '(input)': 'onInput($event.target)',
    '(blur)': 'onBlur($event.target)',
    '[attr.placeholder]': 'placeholder()',
  }
})
export class CreditCardExpiryDateMaskDirective implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly placeholder = input('MM/YY');

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: string | null): void {
    const formattedValue = formatOnInput(value || '');
    this.elementRef.nativeElement.value = formattedValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected onInput(target: HTMLInputElement): void {
    const selectionStart = target.selectionStart;
    const previousValue = target.value;
    const formattedValue = formatOnInput(target.value);

    this.onChange(formattedValue.replace(/\//g, ''));
    target.value = formattedValue;

    if (selectionStart !== null) {
      const newCursorPosition = selectionStart + (formattedValue.length - previousValue.length);
      target.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }

  onBlur(target: HTMLInputElement): void {
    this.onTouched();

    const formattedValue = formatOnBlur(target.value);
    const modelValue = formattedValue.replace(/\//g, '');

    this.onChange(modelValue);
    target.value = formattedValue;
  }
}
