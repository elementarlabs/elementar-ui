import { Directive, ElementRef, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

const formatCvv = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.substring(0, 4);
};

@Directive({
  selector: '[emrCreditCardCvvMask]',
  exportAs: 'emrCreditCardCvvMask',
  host: {
    '(input)': 'onInput($event)',
    '[attr.type]': '"tel"', // Use ‘tel’ to call up the numeric keypad
    '[attr.inputmode]': '"numeric"',
    '[attr.autocomplete]': '"cc-csc"',
    '[attr.placeholder]': 'placeholder()',
  },
})
export class CreditCardCvvMaskDirective {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly hostElement = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly placeholder = input('•••');

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = formatCvv(input.value);

    if (this.ngControl) {
      this.ngControl.control?.setValue(formattedValue, { emitEvent: false });
      this.ngControl.control?.updateValueAndValidity();
    }

    this.hostElement.nativeElement.value = formattedValue;
  }
}
