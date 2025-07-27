import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatRipple } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-exchange-widget',
  imports: [
    MatIcon,
    MatDivider,
    MatRipple,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './exchange-widget.component.html',
  styleUrl: './exchange-widget.component.scss'
})
export class ExchangeWidgetComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input();

  conversionFromRate: number = 1.3275;
  conversionToRate: number = 0.7532;
  currentConversionRate = 1.3275;
  currencyFrom = 'GPB';
  currencyTo = 'USD';

  form: FormGroup = this._fb.group({
    from: [],
    to: []
  });

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }

    this.form.get('from')
      ?.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((value: number) => {
        if (value !== null) {
          const result = (value * this.currentConversionRate).toFixed(4);
          this.form.get('to')?.setValue(result, {
            emitEvent: false
          });
        }
      })
    ;
    this.form.get('to')
      ?.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((value: number) => {
        if (value !== null) {
          const result = (value / this.currentConversionRate).toFixed(4);
          this.form.get('from')?.setValue(result, {
            emitEvent: false
          });
        }
      })
    ;
  }

  toggleCurrencies() {
    const prevCurrencyFrom = this.currencyFrom;
    this.currencyFrom = this.currencyTo;
    this.currencyTo = prevCurrencyFrom;

    const prevConversionToRate = this.conversionToRate;
    this.conversionToRate = this.conversionFromRate;
    this.conversionFromRate = prevConversionToRate;
    this.currentConversionRate = this.conversionFromRate;

    this.form.get('from')?.setValue(this.form.value['from']);
  }
}
