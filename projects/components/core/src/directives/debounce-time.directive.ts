import { Directive, input, model, numberAttribute } from '@angular/core';

@Directive({
  selector: '[emrDebounceTime]',
  host: {
    '[value]': 'value()',
    '(input)': 'handleInput($event.target.value)',
  },
})
export class DebounceTimeDirective {
  private debounceTimer?: ReturnType<typeof setTimeout>;

  readonly debounceTime = input(300, { transform: numberAttribute });
  readonly value = model<string>();

  protected handleInput(value: string): void {
    clearTimeout(this.debounceTimer);

    if (!value || !this.debounceTime()) {
      this.value.set(value);
    } else {
      this.debounceTimer = setTimeout(
        () => this.value.set(value),
        this.debounceTime()
      );
    }
  }
}
