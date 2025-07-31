import { Directive, ElementRef, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

const formatCreditCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const trimmed = cleaned.substring(0, 16);
  const groups = trimmed.match(/.{1,4}/g);
  return groups?.join(' ') ?? '';
};

@Directive({
  selector: '[emrCreditCardNumberMask]',
  exportAs: 'emrCreditCardNumberMask',
  host: {
    '(input)': 'onInput($event)',
    '[attr.type]': '"tel"', // Use ‘tel’ to call up the numeric keypad
    '[attr.autocomplete]': '"cc-number"',
    '[attr.inputmode]': '"numeric"',
    '[attr.placeholder]': 'placeholder()',
  },
})
export class CreditCardNumberMaskDirective {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly hostElement = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly placeholder = input('0000 0000 0000 0000');

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectionStart = input.selectionStart;
    const previousValue = input.value;

    const formattedValue = formatCreditCardNumber(input.value);

    if (this.ngControl) {
      this.ngControl.control?.setValue(formattedValue.replace(/\s/g, ''), { emitEvent: false });
      this.ngControl.control?.updateValueAndValidity();
    }

    this.hostElement.nativeElement.value = formattedValue;

    if (selectionStart !== null) {
      const newCursorPosition = selectionStart + (formattedValue.length - previousValue.length);
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }
}
