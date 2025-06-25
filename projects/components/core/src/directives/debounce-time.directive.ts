import { Directive, ElementRef, forwardRef, input, numberAttribute, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[emrDebounceTime][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DebounceTimeDirective),
      multi: true,
    },
  ],
  host: {
    '(input)': 'handleInput($event.target.value)',
    '(blur)': 'handleBlur()'
  }
})
export class DebounceTimeDirective implements ControlValueAccessor {
  private debounceTimer?: ReturnType<typeof setTimeout>;

  readonly debounceTime = input(300, { transform: numberAttribute });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  writeValue(value: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  protected handleInput(value: string): void {
    clearTimeout(this.debounceTimer);

    if (!this.debounceTime()) {
      this.onChange(value);
    } else {
      this.debounceTimer = setTimeout(() => {
        this.onChange(value);
      }, this.debounceTime());
    }
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}
