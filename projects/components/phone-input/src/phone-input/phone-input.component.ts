import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  booleanAttribute, inject,
  viewChild, input, effect, output, DestroyRef, computed, signal, AfterViewInit
} from '@angular/core';
import { FormGroupDirective, NG_VALIDATORS, NgControl, NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorStateMatcher, MatRipple } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import {
  AsYouType,
  CountryCode as CC,
  PhoneNumber,
  getExampleNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import { Subject } from 'rxjs';
import { CountryCode } from '../data/country-code';
import { Country } from '../model/country.model';
import { PhoneNumberFormat } from '../model/phone-number-format.model';
import { phoneValidator } from '../phone.validator';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatInput } from '@angular/material/input';
import { SearchPipe } from '../search.pipe';
import { IconComponent } from '@elementar-ui/components/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'emr-phone-input',
  exportAs: 'emrPhoneInput',
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss',
  imports: [
    MatRipple,
    MatMenuTrigger,
    IconComponent,
    MatIcon,
    MatMenu,
    ReactiveFormsModule,
    FormsModule,
    MatMenuItem,
    MatDivider,
    MatInput,
    SearchPipe,
  ],
  providers: [
    CountryCode,
    {
      provide: MatFormFieldControl,
      useExisting: PhoneInputComponent
    },
    {
      provide: NG_VALIDATORS,
      useValue: phoneValidator,
      multi: true,
    },
  ],
  host: {
    'class': 'emr-phone-input',
    '[class.is-floating]': 'shouldLabelFloat',
  }
})
export class PhoneInputComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  private _destroyRef = inject(DestroyRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private countryCodeData = inject(CountryCode);
  private _focusMonitor = inject(FocusMonitor);
  private _elementRef = inject(ElementRef<HTMLElement>)
  private ngControl = inject(NgControl, { optional: true });
  private _errorStateMatcher = inject(ErrorStateMatcher);
  private _parentForm = inject(NgForm, { optional: true });

  static nextId = 0;

  readonly menuSearchInput = viewChild<ElementRef<HTMLInputElement>>('menuSearchInput');
  readonly focusable = viewChild.required<ElementRef>('focusable');

  get id(): string {
    return `emr-phone-input-${PhoneInputComponent.nextId++}`;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  autocomplete = input<AutoFill>('on');
  errorStateMatcher = input<ErrorStateMatcher>(this._errorStateMatcher);
  onlyCountries = input<string[]>([]);
  preferredCountries = input<string[]>([]);
  format = input<PhoneNumberFormat>('default');
  defaultSelectedCountryCode = input<string>('us');
  readonly _placeholder = input<string>('', { alias: 'placeholder' });

  @Input({ alias: 'required', transform: booleanAttribute })
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next(undefined);
  }
  get required(): boolean {
    return this._required;
  }

  phoneDisabled = input(false, {
    alias: 'disabled',
    transform: booleanAttribute
  });

  isDisabled = computed(() => {
    return this._disabled || this.phoneDisabled();
  });

  get empty(): boolean {
    return !this.phoneNumber;
  }

  readonly countryChanged = output<Country>();

  private _required = false;
  private _disabled = false;
  stateChanges = new Subject<void>();
  focused = false;
  describedBy = '';
  phoneNumber?: string = '';
  allCountries: Country[] = [];
  preferredCountriesInDropDown: Country[] = [];
  selectedCountry = signal<Country | null>(null);
  numberInstance?: PhoneNumber;
  value?: any;
  searchCriteria?: string;

  private _previousFormattedNumber?: string;

  onTouched = () => {}
  propagateChange = (_: any) => {}

  private errorState?: boolean;

  constructor(
    @Optional() @Self() _ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
  ) {
    this._focusMonitor
      .monitor(this._elementRef, true)
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((origin) => {
        if (this.focused && !origin) {
          this.onTouched();
        }

        this.focused = !!origin
        this.stateChanges.next();
      });

    this.fetchCountryData();

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      this.phoneNumber = this.formattedPhoneNumber;
      this.stateChanges.next();
    });
  }

  ngOnInit() {
    if (this.onlyCountries().length) {
      this.allCountries = this.allCountries.filter((c) => this.onlyCountries().includes(c.shortCode));
    }

    if (this.preferredCountries().length) {
      this.preferredCountries().forEach((shortCode: string) => {
        const preferredCountry = this.allCountries
          .filter((c) => {
            return c.shortCode === shortCode
          })
          .shift();

        if (preferredCountry) {
          this.preferredCountriesInDropDown.push(preferredCountry);
        }
      });
    }

    if (this.numberInstance && this.numberInstance.country) {
      // If an existing number is present, we use it to determine selectedCountry
      this.selectedCountry.set(this.getCountry(this.numberInstance.country));
    }

    if (!this.selectedCountry()) {
      this.selectedCountry.set(
        this.allCountries.find((country) => country.shortCode === this.defaultSelectedCountryCode()) as Country
      );
    }

    this.countryChanged.emit(this.selectedCountry() as Country);
    this._changeDetectorRef.detectChanges();
    this.stateChanges.next();
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      const isInvalid = this.errorStateMatcher().isErrorState(
        this.ngControl.control,
        this._parentForm
      );
      this.errorState =
        (isInvalid && !this.ngControl.control?.value) || (!this.focused ? isInvalid : false);
    }
  }

  updateErrorState() {
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  public onPhoneNumberChange(): void {
    if (!this.phoneNumber) {
      this.value = '';
      this.propagateChange(this.value);
      this._changeDetectorRef.markForCheck();
      return;
    }

    try {
      this.numberInstance = parsePhoneNumberFromString(
        this.phoneNumber.toString(),
        this.selectedCountry()?.shortCode.toUpperCase() as CC,
      );
      this.formatAsYouTypeIfEnabled();
      this.value = this.numberInstance?.number;

      if (this.numberInstance && this.numberInstance.isValid()) {
        if (this.phoneNumber !== this.formattedPhoneNumber) {
          this.phoneNumber = this.formattedPhoneNumber;
        }
        if (
          this.selectedCountry()?.shortCode !== this.numberInstance.country &&
          this.numberInstance.country
        ) {
          this.selectedCountry.set(this.getCountry(this.numberInstance.country));
          this.countryChanged.emit(this.selectedCountry() as Country);
        }
      }
    } catch (e) {
      // if no possible numbers are there,
      // then the full number is passed so that validator could be triggered and proper error could be shown
      this.value = this.phoneNumber.toString();
    }

    this.propagateChange(this.value);
    this._changeDetectorRef.markForCheck();
  }

  public onCountrySelect(country: Country, el: any): void {
    if (this.phoneNumber) {
      this.phoneNumber = this.numberInstance?.nationalNumber;
    }

    if (this.selectedCountry() !== country) {
      this.reset();
    }

    this.selectedCountry.set(country);
    this.countryChanged.emit(this.selectedCountry() as Country);
    this.onPhoneNumberChange();
    el.focus();
  }

  public getCountry(shortCode: CC): Country {
    return (this.allCountries.find((c) => c.shortCode === shortCode.toLowerCase()) || {
      name: 'UN',
      shortCode: 'UN',
      dialCode: undefined,
      priority: 0,
      areaCodes: undefined,
      flagClass: 'UN',
      placeHolder: '',
    }) as Country;
  }

  public onInputKeyPress(event: any): void {
    const pattern = /[0-9+\- ]/;

    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  protected fetchCountryData(): void {
    this.allCountries = this.countryCodeData.allCountries;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this._changeDetectorRef.detectChanges();
    this.stateChanges.next(undefined);
  }

  writeValue(value: any): void {
    if (value) {
      this.numberInstance = parsePhoneNumberFromString(value);

      if (this.numberInstance) {
        const countryCode = this.numberInstance.country;
        this.phoneNumber = this.formattedPhoneNumber;

        if (!countryCode) {
          return;
        }

        setTimeout(() => {
          this.selectedCountry.set(this.getCountry(countryCode));
          this.countryChanged.emit(this.selectedCountry() as Country);
          // Initial value is set
          this._changeDetectorRef.detectChanges();
          this.stateChanges.next();
        }, 1);
      } else {
        this.phoneNumber = value;
      }
    }

    this.stateChanges.next(undefined);
    // Value is set from outside using setValue()
    this._changeDetectorRef.detectChanges();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }

  reset(): void {
    this.phoneNumber = '';
    this.propagateChange(null);
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next(undefined);
  }

  private get formattedPhoneNumber(): string {
    if (!this.numberInstance) {
      return this.phoneNumber?.toString() || '';
    }
    switch (this.format()) {
      case 'national':
        return this.numberInstance.formatNational();
      case 'international':
        return this.numberInstance.formatInternational();
      default:
        return this.numberInstance.nationalNumber.toString();
    }
  }

  private formatAsYouTypeIfEnabled(): void {
    if (this.format() === 'default') {
      return
    }

    const asYouType: AsYouType = new AsYouType(this.selectedCountry()?.shortCode.toUpperCase() as CC);

    // To avoid caret positioning, we apply formatting only if the caret is at the end:
    if (!this.phoneNumber) {
      return;
    }

    if (this.phoneNumber?.toString().startsWith(this._previousFormattedNumber || '')) {
      this.phoneNumber = asYouType.input(this.phoneNumber.toString());
    }
    this._previousFormattedNumber = this.phoneNumber.toString();
  }
}
