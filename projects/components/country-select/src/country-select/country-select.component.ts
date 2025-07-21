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

  readonly internalCountries: Country[] = [
    { "code": "af", "name": "Afghanistan", "flag": "🇦🇫" },
    { "code": "ax", "name": "Åland Islands", "flag": "🇦🇽" },
    { "code": "al", "name": "Albania", "flag": "🇦🇱" },
    { "code": "dz", "name": "Algeria", "flag": "🇩🇿" },
    { "code": "as", "name": "American Samoa", "flag": "🇦🇸" },
    { "code": "ad", "name": "Andorra", "flag": "🇦🇩" },
    { "code": "ao", "name": "Angola", "flag": "🇦🇴" },
    { "code": "ai", "name": "Anguilla", "flag": "🇦🇮" },
    { "code": "aq", "name": "Antarctica", "flag": "🇦🇶" },
    { "code": "ag", "name": "Antigua and Barbuda", "flag": "🇦🇬" },
    { "code": "ar", "name": "Argentina", "flag": "🇦🇷" },
    { "code": "am", "name": "Armenia", "flag": "🇦🇲" },
    { "code": "aw", "name": "Aruba", "flag": "🇦🇼" },
    { "code": "au", "name": "Australia", "flag": "🇦🇺" },
    { "code": "at", "name": "Austria", "flag": "🇦🇹" },
    { "code": "az", "name": "Azerbaijan", "flag": "🇦🇿" },
    { "code": "bs", "name": "Bahamas", "flag": "🇧🇸" },
    { "code": "bh", "name": "Bahrain", "flag": "🇧🇭" },
    { "code": "bd", "name": "Bangladesh", "flag": "🇧🇩" },
    { "code": "bb", "name": "Barbados", "flag": "🇧🇧" },
    { "code": "by", "name": "Belarus", "flag": "🇧🇾" },
    { "code": "be", "name": "Belgium", "flag": "🇧🇪" },
    { "code": "bz", "name": "Belize", "flag": "🇧🇿" },
    { "code": "bj", "name": "Benin", "flag": "🇧🇯" },
    { "code": "bm", "name": "Bermuda", "flag": "🇧🇲" },
    { "code": "bt", "name": "Bhutan", "flag": "🇧🇹" },
    { "code": "bo", "name": "Bolivia (Plurinational State of)", "flag": "🇧🇴" },
    { "code": "bq", "name": "Bonaire, Sint Eustatius and Saba", "flag": "🇧🇶" },
    { "code": "ba", "name": "Bosnia and Herzegovina", "flag": "🇧🇦" },
    { "code": "bw", "name": "Botswana", "flag": "🇧🇼" },
    { "code": "bv", "name": "Bouvet Island", "flag": "🇧🇻" },
    { "code": "br", "name": "Brazil", "flag": "🇧🇷" },
    { "code": "io", "name": "British Indian Ocean Territory", "flag": "🇮🇴" },
    { "code": "bn", "name": "Brunei Darussalam", "flag": "🇧🇳" },
    { "code": "bg", "name": "Bulgaria", "flag": "🇧🇬" },
    { "code": "bf", "name": "Burkina Faso", "flag": "🇧🇫" },
    { "code": "bi", "name": "Burundi", "flag": "🇧🇮" },
    { "code": "cv", "name": "Cabo Verde", "flag": "🇨🇻" },
    { "code": "kh", "name": "Cambodia", "flag": "🇰🇭" },
    { "code": "cm", "name": "Cameroon", "flag": "🇨🇲" },
    { "code": "ca", "name": "Canada", "flag": "🇨🇦" },
    { "code": "ky", "name": "Cayman Islands", "flag": "🇰🇾" },
    { "code": "cf", "name": "Central African Republic", "flag": "🇨🇫" },
    { "code": "td", "name": "Chad", "flag": "🇹🇩" },
    { "code": "cl", "name": "Chile", "flag": "🇨🇱" },
    { "code": "cn", "name": "China", "flag": "🇨🇳" },
    { "code": "cx", "name": "Christmas Island", "flag": "🇨🇽" },
    { "code": "cc", "name": "Cocos (Keeling) Islands", "flag": "🇨🇨" },
    { "code": "co", "name": "Colombia", "flag": "🇨🇴" },
    { "code": "km", "name": "Comoros", "flag": "🇰🇲" },
    { "code": "cg", "name": "Congo", "flag": "🇨🇬" },
    { "code": "cd", "name": "Congo (Democratic Republic of the)", "flag": "🇨🇩" },
    { "code": "ck", "name": "Cook Islands", "flag": "🇨🇰" },
    { "code": "cr", "name": "Costa Rica", "flag": "🇨🇷" },
    { "code": "ci", "name": "Côte d'Ivoire", "flag": "🇨🇮" },
    { "code": "hr", "name": "Croatia", "flag": "🇭🇷" },
    { "code": "cu", "name": "Cuba", "flag": "🇨🇺" },
    { "code": "cw", "name": "Curaçao", "flag": "🇨🇼" },
    { "code": "cy", "name": "Cyprus", "flag": "🇨🇾" },
    { "code": "cz", "name": "Czechia", "flag": "🇨🇿" },
    { "code": "dk", "name": "Denmark", "flag": "🇩🇰" },
    { "code": "dj", "name": "Djibouti", "flag": "🇩🇯" },
    { "code": "dm", "name": "Dominica", "flag": "🇩🇲" },
    { "code": "do", "name": "Dominican Republic", "flag": "🇩🇴" },
    { "code": "ec", "name": "Ecuador", "flag": "🇪🇨" },
    { "code": "eg", "name": "Egypt", "flag": "🇪🇬" },
    { "code": "sv", "name": "El Salvador", "flag": "🇸🇻" },
    { "code": "gq", "name": "Equatorial Guinea", "flag": "🇬🇶" },
    { "code": "er", "name": "Eritrea", "flag": "🇪🇷" },
    { "code": "ee", "name": "Estonia", "flag": "🇪🇪" },
    { "code": "sz", "name": "Eswatini", "flag": "🇸🇿" },
    { "code": "et", "name": "Ethiopia", "flag": "🇪🇹" },
    { "code": "fk", "name": "Falkland Islands (Malvinas)", "flag": "🇫🇰" },
    { "code": "fo", "name": "Faroe Islands", "flag": "🇫🇴" },
    { "code": "fj", "name": "Fiji", "flag": "🇫🇯" },
    { "code": "fi", "name": "Finland", "flag": "🇫🇮" },
    { "code": "fr", "name": "France", "flag": "🇫🇷" },
    { "code": "gf", "name": "French Guiana", "flag": "🇬🇫" },
    { "code": "pf", "name": "French Polynesia", "flag": "🇵🇫" },
    { "code": "tf", "name": "French Southern Territories", "flag": "🇹🇫" },
    { "code": "ga", "name": "Gabon", "flag": "🇬🇦" },
    { "code": "gm", "name": "Gambia", "flag": "🇬🇲" },
    { "code": "ge", "name": "Georgia", "flag": "🇬🇪" },
    { "code": "de", "name": "Germany", "flag": "🇩🇪" },
    { "code": "gh", "name": "Ghana", "flag": "🇬🇭" },
    { "code": "gi", "name": "Gibraltar", "flag": "🇬🇮" },
    { "code": "gr", "name": "Greece", "flag": "🇬🇷" },
    { "code": "gl", "name": "Greenland", "flag": "🇬🇱" },
    { "code": "gd", "name": "Grenada", "flag": "🇬🇩" },
    { "code": "gp", "name": "Guadeloupe", "flag": "🇬🇵" },
    { "code": "gu", "name": "Guam", "flag": "🇬🇺" },
    { "code": "gt", "name": "Guatemala", "flag": "🇬🇹" },
    { "code": "gg", "name": "Guernsey", "flag": "🇬🇬" },
    { "code": "gn", "name": "Guinea", "flag": "🇬🇳" },
    { "code": "gw", "name": "Guinea-Bissau", "flag": "🇬🇼" },
    { "code": "gy", "name": "Guyana", "flag": "🇬🇾" },
    { "code": "ht", "name": "Haiti", "flag": "🇭🇹" },
    { "code": "hm", "name": "Heard Island and McDonald Islands", "flag": "🇭🇲" },
    { "code": "va", "name": "Holy See", "flag": "🇻🇦" },
    { "code": "hn", "name": "Honduras", "flag": "🇭🇳" },
    { "code": "hk", "name": "Hong Kong", "flag": "🇭🇰" },
    { "code": "hu", "name": "Hungary", "flag": "🇭🇺" },
    { "code": "is", "name": "Iceland", "flag": "🇮🇸" },
    { "code": "in", "name": "India", "flag": "🇮🇳" },
    { "code": "id", "name": "Indonesia", "flag": "🇮🇩" },
    { "code": "ir", "name": "Iran (Islamic Republic of)", "flag": "🇮🇷" },
    { "code": "iq", "name": "Iraq", "flag": "🇮🇶" },
    { "code": "ie", "name": "Ireland", "flag": "🇮🇪" },
    { "code": "im", "name": "Isle of Man", "flag": "🇮🇲" },
    { "code": "il", "name": "Israel", "flag": "🇮🇱" },
    { "code": "it", "name": "Italy", "flag": "🇮🇹" },
    { "code": "jm", "name": "Jamaica", "flag": "🇯🇲" },
    { "code": "jp", "name": "Japan", "flag": "🇯🇵" },
    { "code": "je", "name": "Jersey", "flag": "🇯🇪" },
    { "code": "jo", "name": "Jordan", "flag": "🇯🇴" },
    { "code": "kz", "name": "Kazakhstan", "flag": "🇰🇿" },
    { "code": "ke", "name": "Kenya", "flag": "🇰🇪" },
    { "code": "ki", "name": "Kiribati", "flag": "🇰🇮" },
    { "code": "kp", "name": "Korea (Democratic People's Republic of)", "flag": "🇰🇵" },
    { "code": "kr", "name": "Korea (Republic of)", "flag": "🇰🇷" },
    { "code": "kw", "name": "Kuwait", "flag": "🇰🇼" },
    { "code": "kg", "name": "Kyrgyzstan", "flag": "🇰🇬" },
    { "code": "la", "name": "Lao People's Democratic Republic", "flag": "🇱🇦" },
    { "code": "lv", "name": "Latvia", "flag": "🇱🇻" },
    { "code": "lb", "name": "Lebanon", "flag": "🇱🇧" },
    { "code": "ls", "name": "Lesotho", "flag": "🇱🇸" },
    { "code": "lr", "name": "Liberia", "flag": "🇱🇷" },
    { "code": "ly", "name": "Libya", "flag": "🇱🇾" },
    { "code": "li", "name": "Liechtenstein", "flag": "🇱🇮" },
    { "code": "lt", "name": "Lithuania", "flag": "🇱🇹" },
    { "code": "lu", "name": "Luxembourg", "flag": "🇱🇺" },
    { "code": "mo", "name": "Macao", "flag": "🇲🇴" },
    { "code": "mg", "name": "Madagascar", "flag": "🇲🇬" },
    { "code": "mw", "name": "Malawi", "flag": "🇲🇼" },
    { "code": "my", "name": "Malaysia", "flag": "🇲🇾" },
    { "code": "mv", "name": "Maldives", "flag": "🇲🇻" },
    { "code": "ml", "name": "Mali", "flag": "🇲🇱" },
    { "code": "mt", "name": "Malta", "flag": "🇲🇹" },
    { "code": "mh", "name": "Marshall Islands", "flag": "🇲🇭" },
    { "code": "mq", "name": "Martinique", "flag": "🇲🇶" },
    { "code": "mr", "name": "Mauritania", "flag": "🇲🇷" },
    { "code": "mu", "name": "Mauritius", "flag": "🇲🇺" },
    { "code": "yt", "name": "Mayotte", "flag": "🇾🇹" },
    { "code": "mx", "name": "Mexico", "flag": "🇲🇽" },
    { "code": "fm", "name": "Micronesia (Federated States of)", "flag": "🇫🇲" },
    { "code": "md", "name": "Moldova (Republic of)", "flag": "🇲🇩" },
    { "code": "mc", "name": "Monaco", "flag": "🇲🇨" },
    { "code": "mn", "name": "Mongolia", "flag": "🇲🇳" },
    { "code": "me", "name": "Montenegro", "flag": "🇲🇪" },
    { "code": "ms", "name": "Montserrat", "flag": "🇲🇸" },
    { "code": "ma", "name": "Morocco", "flag": "🇲🇦" },
    { "code": "mz", "name": "Mozambique", "flag": "🇲🇿" },
    { "code": "mm", "name": "Myanmar", "flag": "🇲🇲" },
    { "code": "na", "name": "Namibia", "flag": "🇳🇦" },
    { "code": "nr", "name": "Nauru", "flag": "🇳🇷" },
    { "code": "np", "name": "Nepal", "flag": "🇳🇵" },
    { "code": "nl", "name": "Netherlands", "flag": "🇳🇱" },
    { "code": "nc", "name": "New Caledonia", "flag": "🇳🇨" },
    { "code": "nz", "name": "New Zealand", "flag": "🇳🇿" },
    { "code": "ni", "name": "Nicaragua", "flag": "🇳🇮" },
    { "code": "ne", "name": "Niger", "flag": "🇳🇪" },
    { "code": "ng", "name": "Nigeria", "flag": "🇳🇬" },
    { "code": "nu", "name": "Niue", "flag": "🇳🇺" },
    { "code": "nf", "name": "Norfolk Island", "flag": "🇳🇫" },
    { "code": "mk", "name": "North Macedonia", "flag": "🇲🇰" },
    { "code": "mp", "name": "Northern Mariana Islands", "flag": "🇲🇵" },
    { "code": "no", "name": "Norway", "flag": "🇳🇴" },
    { "code": "om", "name": "Oman", "flag": "🇴🇲" },
    { "code": "pk", "name": "Pakistan", "flag": "🇵🇰" },
    { "code": "pw", "name": "Palau", "flag": "🇵🇼" },
    { "code": "ps", "name": "Palestine, State of", "flag": "🇵🇸" },
    { "code": "pa", "name": "Panama", "flag": "🇵🇦" },
    { "code": "pg", "name": "Papua New Guinea", "flag": "🇵🇬" },
    { "code": "py", "name": "Paraguay", "flag": "🇵🇾" },
    { "code": "pe", "name": "Peru", "flag": "🇵🇪" },
    { "code": "ph", "name": "Philippines", "flag": "🇵🇭" },
    { "code": "pn", "name": "Pitcairn", "flag": "🇵🇳" },
    { "code": "pl", "name": "Poland", "flag": "🇵🇱" },
    { "code": "pt", "name": "Portugal", "flag": "🇵🇹" },
    { "code": "pr", "name": "Puerto Rico", "flag": "🇵🇷" },
    { "code": "qa", "name": "Qatar", "flag": "🇶🇦" },
    { "code": "re", "name": "Réunion", "flag": "🇷🇪" },
    { "code": "ro", "name": "Romania", "flag": "🇷🇴" },
    { "code": "ru", "name": "Russian Federation", "flag": "🇷🇺" },
    { "code": "rw", "name": "Rwanda", "flag": "🇷🇼" },
    { "code": "bl", "name": "Saint Barthélemy", "flag": "🇧🇱" },
    { "code": "sh", "name": "Saint Helena, Ascension and Tristan da Cunha", "flag": "🇸🇭" },
    { "code": "kn", "name": "Saint Kitts and Nevis", "flag": "🇰🇳" },
    { "code": "lc", "name": "Saint Lucia", "flag": "🇱🇨" },
    { "code": "mf", "name": "Saint Martin (French part)", "flag": "🇲🇫" },
    { "code": "pm", "name": "Saint Pierre and Miquelon", "flag": "🇵🇲" },
    { "code": "vc", "name": "Saint Vincent and the Grenadines", "flag": "🇻🇨" },
    { "code": "ws", "name": "Samoa", "flag": "🇼🇸" },
    { "code": "sm", "name": "San Marino", "flag": "🇸🇲" },
    { "code": "st", "name": "Sao Tome and Principe", "flag": "🇸🇹" },
    { "code": "sa", "name": "Saudi Arabia", "flag": "🇸🇦" },
    { "code": "sn", "name": "Senegal", "flag": "🇸🇳" },
    { "code": "rs", "name": "Serbia", "flag": "🇷🇸" },
    { "code": "sc", "name": "Seychelles", "flag": "🇸🇨" },
    { "code": "sl", "name": "Sierra Leone", "flag": "🇸🇱" },
    { "code": "sg", "name": "Singapore", "flag": "🇸🇬" },
    { "code": "sx", "name": "Sint Maarten (Dutch part)", "flag": "🇸🇽" },
    { "code": "sk", "name": "Slovakia", "flag": "🇸🇰" },
    { "code": "si", "name": "Slovenia", "flag": "🇸🇮" },
    { "code": "sb", "name": "Solomon Islands", "flag": "🇸🇧" },
    { "code": "so", "name": "Somalia", "flag": "🇸🇴" },
    { "code": "za", "name": "South Africa", "flag": "🇿🇦" },
    { "code": "gs", "name": "South Georgia and the South Sandwich Islands", "flag": "🇬🇸" },
    { "code": "ss", "name": "South Sudan", "flag": "🇸🇸" },
    { "code": "es", "name": "Spain", "flag": "🇪🇸" },
    { "code": "lk", "name": "Sri Lanka", "flag": "🇱🇰" },
    { "code": "sd", "name": "Sudan", "flag": "🇸🇩" },
    { "code": "sr", "name": "Suriname", "flag": "🇸🇷" },
    { "code": "sj", "name": "Svalbard and Jan Mayen", "flag": "🇸🇯" },
    { "code": "se", "name": "Sweden", "flag": "🇸🇪" },
    { "code": "ch", "name": "Switzerland", "flag": "🇨🇭" },
    { "code": "sy", "name": "Syrian Arab Republic", "flag": "🇸🇾" },
    { "code": "tw", "name": "Taiwan, Province of China", "flag": "🇹🇼" },
    { "code": "tj", "name": "Tajikistan", "flag": "🇹🇯" },
    { "code": "tz", "name": "Tanzania, United Republic of", "flag": "🇹🇿" },
    { "code": "th", "name": "Thailand", "flag": "🇹🇭" },
    { "code": "tl", "name": "Timor-Leste", "flag": "🇹🇱" },
    { "code": "tg", "name": "Togo", "flag": "🇹🇬" },
    { "code": "tk", "name": "Tokelau", "flag": "🇹🇰" },
    { "code": "to", "name": "Tonga", "flag": "🇹🇴" },
    { "code": "tt", "name": "Trinidad and Tobago", "flag": "🇹🇹" },
    { "code": "tn", "name": "Tunisia", "flag": "🇹🇳" },
    { "code": "tr", "name": "Turkey", "flag": "🇹🇷" },
    { "code": "tm", "name": "Turkmenistan", "flag": "🇹🇲" },
    { "code": "tc", "name": "Turks and Caicos Islands", "flag": "🇹🇨" },
    { "code": "tv", "name": "Tuvalu", "flag": "🇹🇻" },
    { "code": "ug", "name": "Uganda", "flag": "🇺🇬" },
    { "code": "ua", "name": "Ukraine", "flag": "🇺🇦" },
    { "code": "ae", "name": "United Arab Emirates", "flag": "🇦🇪" },
    { "code": "gb", "name": "United Kingdom of Great Britain and Northern Ireland", "flag": "🇬🇧" },
    { "code": "us", "name": "United States of America", "flag": "🇺🇸" },
    { "code": "um", "name": "United States Minor Outlying Islands", "flag": "🇺🇲" },
    { "code": "uy", "name": "Uruguay", "flag": "🇺🇾" },
    { "code": "uz", "name": "Uzbekistan", "flag": "🇺🇿" },
    { "code": "vu", "name": "Vanuatu", "flag": "🇻🇺" },
    { "code": "ve", "name": "Venezuela (Bolivarian Republic of)", "flag": "🇻🇪" },
    { "code": "vn", "name": "Viet Nam", "flag": "🇻🇳" },
    { "code": "vg", "name": "Virgin Islands (British)", "flag": "🇻🇬" },
    { "code": "vi", "name": "Virgin Islands (U.S.)", "flag": "🇻🇮" },
    { "code": "wf", "name": "Wallis and Futuna", "flag": "🇼🇫" },
    { "code": "eh", "name": "Western Sahara", "flag": "🇪🇭" },
    { "code": "ye", "name": "Yemen", "flag": "🇾🇪" },
    { "code": "zm", "name": "Zambia", "flag": "🇿🇲" },
    { "code": "zw", "name": "Zimbabwe", "flag": "🇿🇼" }
  ];

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
