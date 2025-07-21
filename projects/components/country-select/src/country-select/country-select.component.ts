import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  forwardRef,
  inject,
  signal,
  computed,
  effect,
  model,
  input,
  InputSignal,
  ModelSignal,
  DestroyRef, viewChild, Renderer2, booleanAttribute,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectChange, MatSelectTrigger } from '@angular/material/select';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { toSignal } from '@angular/core/rxjs-interop';
import { Country } from '../country.interface';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { countries } from '../countries';

@Component({
  selector: 'emr-country-select',
  exportAs: 'emrCountrySelect',
  templateUrl: './country-select.component.html',
  styleUrl: './country-select.component.scss',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => CountrySelectComponent),
    },
  ],
  host: {
    'class': 'emr-country-select',
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  imports: [
    MatOption,
    MatIcon,
    MatIconButton,
    MatSelect,
    MatSelectTrigger,
    ReactiveFormsModule
  ]
})
export class CountrySelectComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<string | null>
{
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);

  static nextId = 0;
  id = `emr-country-select-${CountrySelectComponent.nextId++}`;

  readonly stateChanges = new Subject<void>();
  controlType = 'emr-country-select';
  autofilled?: boolean;

  private readonly _valueSignal = signal<string | null>(null);
  private readonly _focusedSignal = signal(false);
  private _touched = false;

  placeholderInputSignal = input<string>('', { alias: 'placeholder' });
  isRequiredSignal = model<boolean>(false, { alias: 'required' });
  isDisabledSignal = model<boolean>(false, { alias: 'disabled' });

  readonly showCountryCode = input(false, {
    transform: booleanAttribute
  });

  readonly searchCtrl = new FormControl('');
  private readonly searchText = toSignal(this.searchCtrl.valueChanges.pipe(startWith('')), { initialValue: '' });

  readonly internalCountries: Country[] = countries;

  readonly filteredCountries = computed(() => this._filterCountries(this.searchText()));
  readonly selectedCountryDisplay = computed(() => {
    return this.internalCountries.find(c => c.code === this._valueSignal());
  });

  readonly matSelect = viewChild.required<MatSelect>('matSelect');
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private readonly fm = inject(FocusMonitor);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private onChangeFn: (value: string | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.destroyRef.onDestroy(() => {
      this.fm.stopMonitoring(this.elRef.nativeElement);
      this.stateChanges.complete();
    });

    effect(() => {
      this.onChangeFn(this._valueSignal());
    });

    effect(() => {
      this._valueSignal();
      this._focusedSignal();
      this.isRequiredSignal();
      this.isDisabledSignal();
      this.placeholderInputSignal();
      this.ngControl?.control?.status;
      this.stateChanges.next();
    });

    effect(() => {
      if (this.isDisabledSignal()) {
        this.searchCtrl.disable({ emitEvent: false });
      } else {
        this.searchCtrl.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    if (this.ngControl?.control) {
      const control = this.ngControl.control;

      if (control.validator) {
        const validator = control.validator({} as any);
        if (validator && validator['required']) {
          this.isRequiredSignal.set(true);
        }
      }

      this.isDisabledSignal.set(control.disabled);
    }

    const formFieldElement = this._elementRef.nativeElement.closest('.mat-mdc-form-field');

    if (formFieldElement) {
      this._renderer.addClass(formFieldElement, 'mat-mdc-form-field-type-mat-select');
    }
  }

  ngOnDestroy(): void {
  }

  get value(): string | null {
    return this._valueSignal();
  }
  set value(val: string | null) {
    this._valueSignal.set(val);
  }

  get focused(): boolean {
    return this._focusedSignal();
  }

  get placeholder(): string {
    return this.placeholderInputSignal();
  }
  set placeholder(plh: string) {
    this.stateChanges.next();
  }

  get required(): boolean {
    return this.isRequiredSignal();
  }
  set required(req: boolean) {
    this.isRequiredSignal.set(coerceBooleanProperty(req));
  }

  get disabled(): boolean {
    return this.isDisabledSignal();
  }
  set disabled(dis: boolean) {
    this.isDisabledSignal.set(coerceBooleanProperty(dis));
  }

  get empty(): boolean {
    return !this._valueSignal();
  }

  get shouldLabelFloat(): boolean {
    return this._focusedSignal() || !this.empty;
  }

  get errorState(): boolean {
    return !!(this.ngControl?.invalid && (this.ngControl?.touched || this._touched));
  }

  get touched(): boolean {
    return this._touched;
  }

  setDescribedByIds(ids: string[]): void {
    const controlElement = this.elRef.nativeElement.querySelector('.select-trigger');

    if (controlElement) {
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  onContainerClick(): void {
    if (this.disabled) {
      return;
    }

    this._focusedSignal.set(true);
    this.matSelect().onContainerClick();
  }

  writeValue(value: string | null): void {
    this._valueSignal.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = () => {
      this._touched = true;
      fn();
      this.stateChanges.next();
    };
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _filterCountries(searchText: string | null): Country[] {
    const filterValue = (searchText || '').toLowerCase();
    if (!filterValue) {
      return [...this.internalCountries];
    }
    return this.internalCountries.filter((country) =>
      country.name.toLowerCase().includes(filterValue) ||
      country.code.toLowerCase().includes(filterValue)
    );
  }

  onSelectionChange(event: MatSelectChange): void {
    this.value = event.value;
    this.onTouchedFn();
  }

  clearSearch(event: MouseEvent): void {
    event.stopPropagation();
    this.searchCtrl.setValue('');
    this.searchInput().nativeElement.focus();
  }

  onSelectOpened(): void {
    setTimeout(() => {
      this.searchInput().nativeElement.focus();
    });
  }

  onSelectClosed(): void {
    this._focusedSignal.set(false);
    this.searchCtrl.setValue('');

    if (!this._touched) {
      this.onTouchedFn();
    }
  }
}
