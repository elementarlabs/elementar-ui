import {
  booleanAttribute,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  forwardRef, inject,
  input, OnChanges,
  OnInit, output, signal, SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ColorPickerResultFormat } from '../properties';
import { SaturationComponent } from '../saturation/saturation.component';
import { HueComponent } from '../hue/hue.component';
import { AlphaComponent } from '../alpha/alpha.component';
import { TinyColor } from '@ctrl/tinycolor';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'emr-color-picker',
  exportAs: 'emrColorPicker',
  imports: [
    FormsModule,
    AlphaComponent,
    SaturationComponent,
    HueComponent,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
  host: {
    'class': 'emr-color-picker',
    '[class.is-disabled]': '_disabled()',
    '[class.as-dropdown]': 'asDropdown()',
    '(contextmenu)': '_handleContextMenu($event)'
  }
})
export class ColorPickerComponent implements OnInit, OnChanges, ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  color = input<string>('');
  disabled = input(false, {
    transform: booleanAttribute
  });
  asDropdown = input(true, {
    transform: booleanAttribute
  });
  showOpacity = input(true, {
    transform: booleanAttribute
  });
  resultFormat = input<ColorPickerResultFormat>('rgb');

  readonly colorChange = output<string>();
  readonly rawColorChange = output<TinyColor>();

  private tmpColor!: TinyColor;
  protected hexColor!: string;

  protected _color = signal<TinyColor>(new TinyColor('red'));
  protected _colorFromHue = signal<TinyColor | undefined | null>(null);
  protected _disabled = signal(false);
  protected alpha = signal(1);

  ngOnInit() {
    if (this.color()) {
      this._setColor(this.color());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['color'] && changes['color'].previousValue !== changes['color'].currentValue) {
      this._setColor(changes['color'].currentValue);
    }

    if (changes['disabled'] && changes['disabled'].previousValue !== changes['disabled'].currentValue) {
      this._disabled.set(coerceBooleanProperty(changes['disabled'].currentValue));
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(color: string) {
    this._setColor(color);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: BooleanInput) {
    this._disabled.set(coerceBooleanProperty(isDisabled));
  }

  protected async copyToClipboard(event: MouseEvent, hexInput: HTMLInputElement) {
    event.preventDefault();
    event.stopPropagation();
    const color = new TinyColor(this.hexColor);

    if (color.isValid) {
      await navigator.clipboard.writeText(color.toHexString());
    }

    hexInput.blur();
  }

  protected onSaturationColorChange(tinyColor: TinyColor) {
    this.tmpColor = tinyColor.clone();
    const newColor = tinyColor.clone().setAlpha(this.alpha());
    this.rawColorChange.emit(newColor);
    this.emitEvent(newColor);
    this._setHexColor(newColor);
  }

  protected _handleContextMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onAlphaChange(alpha: number) {
    this.alpha.set(alpha);
    const newColor = this.tmpColor.clone();
    newColor.setAlpha(alpha);
    this.rawColorChange.emit(newColor.clone().setAlpha(this.alpha()));
    this.emitEvent(newColor);
  }

  protected onHueColorChange(color: TinyColor) {
    this._colorFromHue.set(color);
  }

  protected onHexColorChange(color: string) {
    if (!color.startsWith('#')) {
      return;
    }

    if (color.length === 4 || color.length === 7) {
      const hexColor = new TinyColor(color);

      if (!hexColor.isValid || hexColor.equals(this._color())) {
        return;
      }

      this._setColor(color, false);
      this.emitEvent(hexColor);
    }
  }

  protected onHexColorBlur() {
    if (!this.hexColor.trim()) {
      this.hexColor = this.tmpColor.toHexString();
    }
  }

  protected _setHexColor(tinyColor: TinyColor) {
    if (!tinyColor.isValid) {
      return;
    }

    const hexColor = new TinyColor(this.hexColor);

    if (hexColor.isValid && hexColor.equals(tinyColor)) {
      return;
    }

    this.hexColor = tinyColor.toHexString();
  }

  private _setColor(color: string, isSetHexColor = true) {
    if (!color) {
      color = 'red';
    }

    let newColor = new TinyColor(color);

    if (!newColor.isValid) {
      return;
    }

    if (!newColor.equals(this._color())) {
      this._color.set(newColor);
      this.tmpColor = this._color().clone();

      if (isSetHexColor) {
        this.hexColor = this.tmpColor.toHexString();
      }
    }
  }

  private emitEvent(newColor: TinyColor) {
    let format = newColor.toRgbString();

    if (this.resultFormat() === 'hex') {
      format = newColor.toHexString();
    } else if (this.resultFormat() === 'hsl') {
      format = newColor.toHslString();
    } else if (this.resultFormat() === 'hsv') {
      format = newColor.toHsvString();
    }

    this.colorChange.emit(format);
    this.onChange(format);
  }
}
