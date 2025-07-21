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
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Currency } from '@elementar-ui/components/currency-select/src/currency.interface';

@Component({
  selector: 'emr-currency-select',
  exportAs: 'emrCurrencySelect',
  templateUrl: './currency-select.component.html',
  styleUrl: './currency-select.component.scss',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => CurrencySelectComponent),
    },
  ],
  host: {
    'class': 'emr-currency-select',
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
export class CurrencySelectComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<string | null>
{
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);

  static nextId = 0;
  id = `emr-currency-select-${CurrencySelectComponent.nextId++}`;

  readonly stateChanges = new Subject<void>();
  controlType = 'emr-currency-select';
  autofilled?: boolean;

  private readonly _valueSignal = signal<string | null>(null);
  private readonly _focusedSignal = signal(false);
  private _touched = false;

  placeholderInputSignal = input<string>('', { alias: 'placeholder' });
  isRequiredSignal = model<boolean>(false, { alias: 'required' });
  isDisabledSignal = model<boolean>(false, { alias: 'disabled' });

  showCountryName = input(false, {
    transform: booleanAttribute
  });

  readonly searchCtrl = new FormControl('');
  private readonly searchText = toSignal(this.searchCtrl.valueChanges.pipe(startWith('')), { initialValue: '' });

  readonly internalCurrencies: Currency[] = [
    { "code": "aed", "name": "UAE Dirham", "symbol": "د.إ", "countryCode": "AE", "flag": "🇦🇪" },
    { "code": "afn", "name": "Afghan Afghani", "symbol": "؋", "countryCode": "AF", "flag": "🇦🇫" },
    { "code": "all", "name": "Albanian Lek", "symbol": "L", "countryCode": "AL", "flag": "🇦🇱" },
    { "code": "amd", "name": "Armenian Dram", "symbol": "֏", "countryCode": "AM", "flag": "🇦🇲" },
    { "code": "ang", "name": "Netherlands Antillean Guilder", "symbol": "ƒ", "countryCode": "AN", "flag": "🇦🇳" },
    { "code": "aoa", "name": "Angolan Kwanza", "symbol": "Kz", "countryCode": "AO", "flag": "🇦🇴" },
    { "code": "ars", "name": "Argentine Peso", "symbol": "$", "countryCode": "AR", "flag": "🇦🇷" },
    { "code": "aud", "name": "Australian Dollar", "symbol": "$", "countryCode": "AU", "flag": "🇦🇺" },
    { "code": "awg", "name": "Aruban Florin", "symbol": "ƒ", "countryCode": "AW", "flag": "🇦🇼" },
    { "code": "azn", "name": "Azerbaijani Manat", "symbol": "₼", "countryCode": "AZ", "flag": "🇦🇿" },
    { "code": "bam", "name": "Bosnia-Herzegovina Convertible Mark", "symbol": "KM", "countryCode": "BA", "flag": "🇧🇦" },
    { "code": "bbd", "name": "Barbadian Dollar", "symbol": "$", "countryCode": "BB", "flag": "🇧🇧" },
    { "code": "bdt", "name": "Bangladeshi Taka", "symbol": "৳", "countryCode": "BD", "flag": "🇧🇩" },
    { "code": "bgn", "name": "Bulgarian Lev", "symbol": "лв", "countryCode": "BG", "flag": "🇧🇬" },
    { "code": "bhd", "name": "Bahraini Dinar", "symbol": ".د.ب", "countryCode": "BH", "flag": "🇧🇭" },
    { "code": "bif", "name": "Burundian Franc", "symbol": "FBu", "countryCode": "BI", "flag": "🇧🇮" },
    { "code": "bmd", "name": "Bermudan Dollar", "symbol": "$", "countryCode": "BM", "flag": "🇧🇲" },
    { "code": "bnd", "name": "Brunei Dollar", "symbol": "$", "countryCode": "BN", "flag": "🇧🇳" },
    { "code": "bob", "name": "Bolivian Boliviano", "symbol": "Bs.", "countryCode": "BO", "flag": "🇧🇴" },
    { "code": "brl", "name": "Brazilian Real", "symbol": "R$", "countryCode": "BR", "flag": "🇧🇷" },
    { "code": "bsd", "name": "Bahamian Dollar", "symbol": "$", "countryCode": "BS", "flag": "🇧🇸" },
    { "code": "btn", "name": "Bhutanese Ngultrum", "symbol": "Nu.", "countryCode": "BT", "flag": "🇧🇹" },
    { "code": "bwp", "name": "Botswanan Pula", "symbol": "P", "countryCode": "BW", "flag": "🇧🇼" },
    { "code": "byn", "name": "Belarusian Ruble", "symbol": "Br", "countryCode": "BY", "flag": "🇧🇾" },
    { "code": "bzd", "name": "Belize Dollar", "symbol": "BZ$", "countryCode": "BZ", "flag": "🇧🇿" },
    { "code": "cad", "name": "Canadian Dollar", "symbol": "$", "countryCode": "CA", "flag": "🇨🇦" },
    { "code": "cdf", "name": "Congolese Franc", "symbol": "FC", "countryCode": "CD", "flag": "🇨🇩" },
    { "code": "chf", "name": "Swiss Franc", "symbol": "CHF", "countryCode": "CH", "flag": "🇨🇭" },
    { "code": "clp", "name": "Chilean Peso", "symbol": "$", "countryCode": "CL", "flag": "🇨🇱" },
    { "code": "cny", "name": "Chinese Yuan", "symbol": "¥", "countryCode": "CN", "flag": "🇨🇳" },
    { "code": "cop", "name": "Colombian Peso", "symbol": "$", "countryCode": "CO", "flag": "🇨🇴" },
    { "code": "crc", "name": "Costa Rican Colón", "symbol": "₡", "countryCode": "CR", "flag": "🇨🇷" },
    { "code": "cup", "name": "Cuban Peso", "symbol": "₱", "countryCode": "CU", "flag": "🇨🇺" },
    { "code": "cve", "name": "Cape Verdean Escudo", "symbol": "$", "countryCode": "CV", "flag": "🇨🇻" },
    { "code": "czk", "name": "Czech Koruna", "symbol": "Kč", "countryCode": "CZ", "flag": "🇨🇿" },
    { "code": "djf", "name": "Djiboutian Franc", "symbol": "Fdj", "countryCode": "DJ", "flag": "🇩🇯" },
    { "code": "dkk", "name": "Danish Krone", "symbol": "kr", "countryCode": "DK", "flag": "🇩🇰" },
    { "code": "dop", "name": "Dominican Peso", "symbol": "RD$", "countryCode": "DO", "flag": "🇩🇴" },
    { "code": "dzd", "name": "Algerian Dinar", "symbol": "د.ج", "countryCode": "DZ", "flag": "🇩🇿" },
    { "code": "egp", "name": "Egyptian Pound", "symbol": "£", "countryCode": "EG", "flag": "🇪🇬" },
    { "code": "ern", "name": "Eritrean Nakfa", "symbol": "Nfk", "countryCode": "ER", "flag": "🇪🇷" },
    { "code": "etb", "name": "Ethiopian Birr", "symbol": "Br", "countryCode": "ET", "flag": "🇪🇹" },
    { "code": "eur", "name": "Euro", "symbol": "€", "countryCode": "EU", "flag": "🇪🇺" },
    { "code": "fjd", "name": "Fijian Dollar", "symbol": "$", "countryCode": "FJ", "flag": "🇫🇯" },
    { "code": "fkp", "name": "Falkland Islands Pound", "symbol": "£", "countryCode": "FK", "flag": "🇫🇰" },
    { "code": "gbp", "name": "British Pound", "symbol": "£", "countryCode": "GB", "flag": "🇬🇧" },
    { "code": "gel", "name": "Georgian Lari", "symbol": "₾", "countryCode": "GE", "flag": "🇬🇪" },
    { "code": "ghs", "name": "Ghanaian Cedi", "symbol": "GH₵", "countryCode": "GH", "flag": "🇬🇭" },
    { "code": "gip", "name": "Gibraltar Pound", "symbol": "£", "countryCode": "GI", "flag": "🇬🇮" },
    { "code": "gmd", "name": "Gambian Dalasi", "symbol": "D", "countryCode": "GM", "flag": "🇬🇲" },
    { "code": "gnf", "name": "Guinean Franc", "symbol": "FG", "countryCode": "GN", "flag": "🇬🇳" },
    { "code": "gtq", "name": "Guatemalan Quetzal", "symbol": "Q", "countryCode": "GT", "flag": "🇬🇹" },
    { "code": "gyd", "name": "Guyanaese Dollar", "symbol": "$", "countryCode": "GY", "flag": "🇬🇾" },
    { "code": "hkd", "name": "Hong Kong Dollar", "symbol": "$", "countryCode": "HK", "flag": "🇭🇰" },
    { "code": "hnl", "name": "Honduran Lempira", "symbol": "L", "countryCode": "HN", "flag": "🇭🇳" },
    { "code": "hrk", "name": "Croatian Kuna", "symbol": "kn", "countryCode": "HR", "flag": "🇭🇷" },
    { "code": "htg", "name": "Haitian Gourde", "symbol": "G", "countryCode": "HT", "flag": "🇭🇹" },
    { "code": "huf", "name": "Hungarian Forint", "symbol": "Ft", "countryCode": "HU", "flag": "🇭🇺" },
    { "code": "idr", "name": "Indonesian Rupiah", "symbol": "Rp", "countryCode": "ID", "flag": "🇮🇩" },
    { "code": "ils", "name": "Israeli New Shekel", "symbol": "₪", "countryCode": "IL", "flag": "🇮🇱" },
    { "code": "inr", "name": "Indian Rupee", "symbol": "₹", "countryCode": "IN", "flag": "🇮🇳" },
    { "code": "iqd", "name": "Iraqi Dinar", "symbol": "ع.د", "countryCode": "IQ", "flag": "🇮🇶" },
    { "code": "irr", "name": "Iranian Rial", "symbol": "﷼", "countryCode": "IR", "flag": "🇮🇷" },
    { "code": "isk", "name": "Icelandic Króna", "symbol": "kr", "countryCode": "IS", "flag": "🇮🇸" },
    { "code": "jmd", "name": "Jamaican Dollar", "symbol": "J$", "countryCode": "JM", "flag": "🇯🇲" },
    { "code": "jod", "name": "Jordanian Dinar", "symbol": "JD", "countryCode": "JO", "flag": "🇯🇴" },
    { "code": "jpy", "name": "Japanese Yen", "symbol": "¥", "countryCode": "JP", "flag": "🇯🇵" },
    { "code": "kes", "name": "Kenyan Shilling", "symbol": "KSh", "countryCode": "KE", "flag": "🇰🇪" },
    { "code": "kgs", "name": "Kyrgystani Som", "symbol": "с", "countryCode": "KG", "flag": "🇰🇬" },
    { "code": "khr", "name": "Cambodian Riel", "symbol": "៛", "countryCode": "KH", "flag": "🇰🇭" },
    { "code": "kmf", "name": "Comorian Franc", "symbol": "CF", "countryCode": "KM", "flag": "🇰🇲" },
    { "code": "kpw", "name": "North Korean Won", "symbol": "₩", "countryCode": "KP", "flag": "🇰🇵" },
    { "code": "krw", "name": "South Korean Won", "symbol": "₩", "countryCode": "KR", "flag": "🇰🇷" },
    { "code": "kwd", "name": "Kuwaiti Dinar", "symbol": "د.ك", "countryCode": "KW", "flag": "🇰🇼" },
    { "code": "kyd", "name": "Cayman Islands Dollar", "symbol": "$", "countryCode": "KY", "flag": "🇰🇾" },
    { "code": "kzt", "name": "Kazakhstani Tenge", "symbol": "₸", "countryCode": "KZ", "flag": "🇰🇿" },
    { "code": "lak", "name": "Laotian Kip", "symbol": "₭", "countryCode": "LA", "flag": "🇱🇦" },
    { "code": "lbp", "name": "Lebanese Pound", "symbol": "£", "countryCode": "LB", "flag": "🇱🇧" },
    { "code": "lkr", "name": "Sri Lankan Rupee", "symbol": "₨", "countryCode": "LK", "flag": "🇱🇰" },
    { "code": "lrd", "name": "Liberian Dollar", "symbol": "$", "countryCode": "LR", "flag": "🇱🇷" },
    { "code": "lsl", "name": "Lesotho Loti", "symbol": "L", "countryCode": "LS", "flag": "🇱🇸" },
    { "code": "lyd", "name": "Libyan Dinar", "symbol": "ل.د", "countryCode": "LY", "flag": "🇱🇾" },
    { "code": "mad", "name": "Moroccan Dirham", "symbol": "د.م.", "countryCode": "MA", "flag": "🇲🇦" },
    { "code": "mdl", "name": "Moldovan Leu", "symbol": "L", "countryCode": "MD", "flag": "🇲🇩" },
    { "code": "mga", "name": "Malagasy Ariary", "symbol": "Ar", "countryCode": "MG", "flag": "🇲🇬" },
    { "code": "mkd", "name": "Macedonian Denar", "symbol": "ден", "countryCode": "MK", "flag": "🇲🇰" },
    { "code": "mmk", "name": "Myanma Kyat", "symbol": "K", "countryCode": "MM", "flag": "🇲🇲" },
    { "code": "mnt", "name": "Mongolian Tugrik", "symbol": "₮", "countryCode": "MN", "flag": "🇲🇳" },
    { "code": "mop", "name": "Macanese Pataca", "symbol": "MOP$", "countryCode": "MO", "flag": "🇲🇴" },
    { "code": "mru", "name": "Mauritanian Ouguiya", "symbol": "UM", "countryCode": "MR", "flag": "🇲🇷" },
    { "code": "mur", "name": "Mauritian Rupee", "symbol": "₨", "countryCode": "MU", "flag": "🇲🇺" },
    { "code": "mvr", "name": "Maldivian Rufiyaa", "symbol": ".ރ", "countryCode": "MV", "flag": "🇲🇻" },
    { "code": "mwk", "name": "Malawian Kwacha", "symbol": "MK", "countryCode": "MW", "flag": "🇲🇼" },
    { "code": "mxn", "name": "Mexican Peso", "symbol": "$", "countryCode": "MX", "flag": "🇲🇽" },
    { "code": "myr", "name": "Malaysian Ringgit", "symbol": "RM", "countryCode": "MY", "flag": "🇲🇾" },
    { "code": "mzn", "name": "Mozambican Metical", "symbol": "MT", "countryCode": "MZ", "flag": "🇲🇿" },
    { "code": "nad", "name": "Namibian Dollar", "symbol": "$", "countryCode": "NA", "flag": "🇳🇦" },
    { "code": "ngn", "name": "Nigerian Naira", "symbol": "₦", "countryCode": "NG", "flag": "🇳🇬" },
    { "code": "nio", "name": "Nicaraguan Córdoba", "symbol": "C$", "countryCode": "NI", "flag": "🇳🇮" },
    { "code": "nok", "name": "Norwegian Krone", "symbol": "kr", "countryCode": "NO", "flag": "🇳🇴" },
    { "code": "npr", "name": "Nepalese Rupee", "symbol": "₨", "countryCode": "NP", "flag": "🇳🇵" },
    { "code": "nzd", "name": "New Zealand Dollar", "symbol": "$", "countryCode": "NZ", "flag": "🇳🇿" },
    { "code": "omr", "name": "Omani Rial", "symbol": "ر.ع.", "countryCode": "OM", "flag": "🇴🇲" },
    { "code": "pab", "name": "Panamanian Balboa", "symbol": "B/.", "countryCode": "PA", "flag": "🇵🇦" },
    { "code": "pen", "name": "Peruvian Nuevo Sol", "symbol": "S/.", "countryCode": "PE", "flag": "🇵🇪" },
    { "code": "pgk", "name": "Papua New Guinean Kina", "symbol": "K", "countryCode": "PG", "flag": "🇵🇬" },
    { "code": "php", "name": "Philippine Peso", "symbol": "₱", "countryCode": "PH", "flag": "🇵🇭" },
    { "code": "pkr", "name": "Pakistani Rupee", "symbol": "₨", "countryCode": "PK", "flag": "🇵🇰" },
    { "code": "pln", "name": "Polish Złoty", "symbol": "zł", "countryCode": "PL", "flag": "🇵🇱" },
    { "code": "pyg", "name": "Paraguayan Guarani", "symbol": "₲", "countryCode": "PY", "flag": "🇵🇾" },
    { "code": "qar", "name": "Qatari Riyal", "symbol": "ر.ق", "countryCode": "QA", "flag": "🇶🇦" },
    { "code": "ron", "name": "Romanian Leu", "symbol": "lei", "countryCode": "RO", "flag": "🇷🇴" },
    { "code": "rsd", "name": "Serbian Dinar", "symbol": "дин.", "countryCode": "RS", "flag": "🇷🇸" },
    { "code": "rub", "name": "Russian Ruble", "symbol": "₽", "countryCode": "RU", "flag": "🇷🇺" },
    { "code": "rwf", "name": "Rwandan Franc", "symbol": "R₣", "countryCode": "RW", "flag": "🇷🇼" },
    { "code": "sar", "name": "Saudi Riyal", "symbol": "ر.س", "countryCode": "SA", "flag": "🇸🇦" },
    { "code": "sbd", "name": "Solomon Islands Dollar", "symbol": "$", "countryCode": "SB", "flag": "🇸🇧" },
    { "code": "scr", "name": "Seychellois Rupee", "symbol": "₨", "countryCode": "SC", "flag": "🇸🇨" },
    { "code": "sdg", "name": "Sudanese Pound", "symbol": "ج.س.", "countryCode": "SD", "flag": "🇸🇩" },
    { "code": "sek", "name": "Swedish Krona", "symbol": "kr", "countryCode": "SE", "flag": "🇸🇪" },
    { "code": "sgd", "name": "Singapore Dollar", "symbol": "$", "countryCode": "SG", "flag": "🇸🇬" },
    { "code": "shp", "name": "Saint Helena Pound", "symbol": "£", "countryCode": "SH", "flag": "🇸🇭" },
    { "code": "sll", "name": "Sierra Leonean Leone", "symbol": "Le", "countryCode": "SL", "flag": "🇸🇱" },
    { "code": "sos", "name": "Somali Shilling", "symbol": "S", "countryCode": "SO", "flag": "🇸🇴" },
    { "code": "srd", "name": "Surinamese Dollar", "symbol": "$", "countryCode": "SR", "flag": "🇸🇷" },
    { "code": "ssp", "name": "South Sudanese Pound", "symbol": "£", "countryCode": "SS", "flag": "🇸🇸" },
    { "code": "stn", "name": "São Tomé and Príncipe Dobra", "symbol": "Db", "countryCode": "ST", "flag": "🇸🇹" },
    { "code": "svc", "name": "Salvadoran Colón", "symbol": "$", "countryCode": "SV", "flag": "🇸🇻" },
    { "code": "syp", "name": "Syrian Pound", "symbol": "£", "countryCode": "SY", "flag": "🇸🇾" },
    { "code": "szl", "name": "Swazi Lilangeni", "symbol": "L", "countryCode": "SZ", "flag": "🇸🇿" },
    { "code": "thb", "name": "Thai Baht", "symbol": "฿", "countryCode": "TH", "flag": "🇹🇭" },
    { "code": "tjs", "name": "Tajikistani Somoni", "symbol": "SM", "countryCode": "TJ", "flag": "🇹🇯" },
    { "code": "tmt", "name": "Turkmenistani Manat", "symbol": "T", "countryCode": "TM", "flag": "🇹🇲" },
    { "code": "tnd", "name": "Tunisian Dinar", "symbol": "د.ت", "countryCode": "TN", "flag": "🇹🇳" },
    { "code": "top", "name": "Tongan Paʻanga", "symbol": "T$", "countryCode": "TO", "flag": "🇹🇴" },
    { "code": "try", "name": "Turkish Lira", "symbol": "₺", "countryCode": "TR", "flag": "🇹🇷" },
    { "code": "ttd", "name": "Trinidad and Tobago Dollar", "symbol": "TT$", "countryCode": "TT", "flag": "🇹🇹" },
    { "code": "twd", "name": "New Taiwan Dollar", "symbol": "NT$", "countryCode": "TW", "flag": "🇹🇼" },
    { "code": "tzs", "name": "Tanzanian Shilling", "symbol": "TSh", "countryCode": "TZ", "flag": "🇹🇿" },
    { "code": "uah", "name": "Ukrainian Hryvnia", "symbol": "₴", "countryCode": "UA", "flag": "🇺🇦" },
    { "code": "ugx", "name": "Ugandan Shilling", "symbol": "USh", "countryCode": "UG", "flag": "🇺🇬" },
    { "code": "usd", "name": "United States Dollar", "symbol": "$", "countryCode": "US", "flag": "🇺🇸" },
    { "code": "uyu", "name": "Uruguayan Peso", "symbol": "$U", "countryCode": "UY", "flag": "🇺🇾" },
    { "code": "uzs", "name": "Uzbekistani Som", "symbol": "сўм", "countryCode": "UZ", "flag": "🇺🇿" },
    { "code": "vef", "name": "Venezuelan Bolívar Fuerte", "symbol": "Bs", "countryCode": "VE", "flag": "🇻🇪" },
    { "code": "vnd", "name": "Vietnamese Dong", "symbol": "₫", "countryCode": "VN", "flag": "🇻🇳" },
    { "code": "vuv", "name": "Vanuatu Vatu", "symbol": "VT", "countryCode": "VU", "flag": "🇻🇺" },
    { "code": "wst", "name": "Samoan Tala", "symbol": "WS$", "countryCode": "WS", "flag": "🇼🇸" },
    { "code": "xaf", "name": "CFA Franc BEAC", "symbol": "FCFA", "countryCode": "CM", "flag": "🇨🇲" },
    { "code": "xcd", "name": "East Caribbean Dollar", "symbol": "$", "countryCode": "AG", "flag": "🇦🇬" },
    { "code": "xof", "name": "CFA Franc BCEAO", "symbol": "CFA", "countryCode": "BJ", "flag": "🇧🇯" },
    { "code": "xpf", "name": "CFP Franc", "symbol": "₣", "countryCode": "PF", "flag": "🇵🇫" },
    { "code": "yer", "name": "Yemeni Rial", "symbol": "﷼", "countryCode": "YE", "flag": "🇾🇪" },
    { "code": "zar", "name": "South African Rand", "symbol": "R", "countryCode": "ZA", "flag": "🇿🇦" },
    { "code": "zmw", "name": "Zambian Kwacha", "symbol": "ZK", "countryCode": "ZM", "flag": "🇿🇲" },
    { "code": "zwl", "name": "Zimbabwean Dollar", "symbol": "$", "countryCode": "ZW", "flag": "🇿🇼" }
  ];

  readonly filteredCurrencies = computed(() => this._filterCurrencies(this.searchText()));
  readonly selectedCurrencyDisplay = computed(() => {
    return this.internalCurrencies.find(c => c.code === this._valueSignal());
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

  private _filterCurrencies(searchText: string | null): Currency[] {
    const filterValue = (searchText || '').toLowerCase();
    if (!filterValue) {
      return [...this.internalCurrencies];
    }
    return this.internalCurrencies.filter((currency) =>
      currency.name.toLowerCase().includes(filterValue) ||
      currency.code.toLowerCase().includes(filterValue)
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
