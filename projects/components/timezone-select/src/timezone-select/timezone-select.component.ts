import {
  booleanAttribute, ChangeDetectionStrategy,
  Component, computed, effect, ElementRef,
  forwardRef,
  inject,
  input,
  LOCALE_ID, model,
  OnInit, Renderer2,
  signal, untracked, viewChild
} from '@angular/core';
import { TimezoneGroup, TimezoneUtils } from '../timezone-utils';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  ControlValueAccessor, FormsModule,
  NgControl
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FilterTimezonesPipe } from '../filter-timezones.pipe';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

let nextId = 0;

@Component({
  selector: 'emr-timezone-select',
  exportAs: 'emrTimezoneSelect',
  imports: [
    MatSelect,
    MatOption,
    FormsModule,
    FilterTimezonesPipe,
    MatIcon,
    MatIconButton
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TimezoneSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timezone-select.component.html',
  styleUrl: './timezone-select.component.scss',
  host: {
    'class': 'emr-timezone-select',
    '[id]': 'id',
  }
})
export class TimezoneSelectComponent implements OnInit, MatFormFieldControl<any>, ControlValueAccessor {
  protected localeId = inject(LOCALE_ID);
  protected renderer = inject(Renderer2);
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  ngControl = inject(NgControl, { optional: true, self: true });

  private searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  private selectRef = viewChild.required<MatSelect>('select');

  protected timezoneGroups = signal<TimezoneGroup[]>([]);
  readonly touched = signal(false);
  readonly stateChanges = new Subject<void>();
  readonly controlType = 'emr-timezone-select';
  readonly id = `emr-timezone-select-${nextId++}`;
  readonly _userAriaDescribedBy = input<string>('', { alias: 'aria-describedby' });
  readonly locale = input<string>(this.localeId);
  readonly _placeholder = input<string>('', { alias: 'placeholder' });
  readonly _required = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly _disabledByInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly _value = model<string | null>(null, { alias: 'value' });
  protected searchTerm = model('');
  private readonly _focused = signal(false);
  private readonly _disabledByCva = signal(false);
  private readonly _disabled = computed(() => this._disabledByInput() || this._disabledByCva());

  onChange = (_: any) => {};
  onTouched = () => {};

  get focused(): boolean {
    return this._focused();
  }

  get empty() {
    return !this._value() || this._value()?.trim() === '';
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get userAriaDescribedBy() {
    return this._userAriaDescribedBy();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get required(): boolean {
    return this._required();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get value(): string | null {
    return this._value();
  }

  get errorState(): boolean {
    // @ts-ignore
    return this.ngControl?.invalid && this.touched();
  }

  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      // Read signals to trigger effect.
      this._placeholder();
      this._required();
      this._disabled();
      this._focused();
      // Propagate state changes.
      untracked(() => this.stateChanges.next());
    });
  }

  ngOnInit() {
    const locale = this.locale() || this.localeId;
    this.timezoneGroups.set(TimezoneUtils.getLocalizedAll(locale, true));
    const formFieldElement = this._elementRef.nativeElement.closest('.mat-mdc-form-field');

    if (formFieldElement) {
      this.renderer.addClass(formFieldElement, 'mat-mdc-form-field-type-mat-select');
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn() {
    if (!this._focused()) {
      this._focused.set(true);
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched.set(true);
      this._focused.set(false);
      this.onTouched();
    }
  }

  onContainerClick(event: MouseEvent) {
    if (this.disabled) {
      return;
    }

    this._focused.set(true);
    this.selectRef().onContainerClick();
  }

  setDescribedByIds(ids: string[]) {
  }

  writeValue(timezone: string | null): void {
    this._updateValue(timezone);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
  }

  protected onSelectOpened(): void {
    setTimeout(() => {
      this.searchInput().nativeElement.focus();
    });
  }

  protected clearSearch() {
    this.searchTerm.set('');
  }

  protected onSelectClosed() {
    this._focused.set(false);
    this.searchTerm.set('');
  }

  protected onModelChange(value: string) {
    this._value.set(value);
    this.onChange(value);
  }

  private _updateValue(value: string | null) {
    const current = this._value();

    if (current === value) {
      return;
    }

    this._value.set(value);
  }
}
