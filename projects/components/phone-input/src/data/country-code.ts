import { Injectable } from '@angular/core';

@Injectable()
export class CountryCode {
  public allCountries = [
    { name: "Afghanistan", shortCode: "af", phoneCode: "+93" },
    { name: "Albania", shortCode: "al", phoneCode: "+355" },
    { name: "Algeria", shortCode: "dz", phoneCode: "+213" },
    { name: "American Samoa", shortCode: "as", phoneCode: "+1-684" },
    { name: "Andorra", shortCode: "ad", phoneCode: "+376" },
    { name: "Angola", shortCode: "ao", phoneCode: "+244" },
    { name: "Anguilla", shortCode: "ai", phoneCode: "+1-264" },
    { name: "Antigua and Barbuda", shortCode: "ag", phoneCode: "+1-268" },
    { name: "Argentina", shortCode: "ar", phoneCode: "+54" },
    { name: "Armenia", shortCode: "am", phoneCode: "+374" },
    { name: "Aruba", shortCode: "aw", phoneCode: "+297" },
    { name: "Australia", shortCode: "au", phoneCode: "+61" },
    { name: "Austria", shortCode: "at", phoneCode: "+43" },
    { name: "Azerbaijan", shortCode: "az", phoneCode: "+994" },
    { name: "Bahamas", shortCode: "bs", phoneCode: "+1-242" },
    { name: "Bahrain", shortCode: "bh", phoneCode: "+973" },
    { name: "Bangladesh", shortCode: "bd", phoneCode: "+880" },
    { name: "Barbados", shortCode: "bb", phoneCode: "+1-246" },
    { name: "Belarus", shortCode: "by", phoneCode: "+375" },
    { name: "Belgium", shortCode: "be", phoneCode: "+32" },
    { name: "Belize", shortCode: "bz", phoneCode: "+501" },
    { name: "Benin", shortCode: "bj", phoneCode: "+229" },
    { name: "Bermuda", shortCode: "bm", phoneCode: "+1-441" },
    { name: "Bhutan", shortCode: "bt", phoneCode: "+975" },
    { name: "Bolivia", shortCode: "bo", phoneCode: "+591" },
    { name: "Bonaire, Sint Eustatius and Saba", shortCode: "bq", phoneCode: "+599" },
    { name: "Bosnia and Herzegovina", shortCode: "ba", phoneCode: "+387" },
    { name: "Botswana", shortCode: "bw", phoneCode: "+267" },
    { name: "Bouvet Island", shortCode: "bv", phoneCode: "" },
    { name: "Brazil", shortCode: "br", phoneCode: "+55" },
    { name: "British Indian Ocean Territory", shortCode: "io", phoneCode: "+246" },
    { name: "Brunei Darussalam", shortCode: "bn", phoneCode: "+673" },
    { name: "Bulgaria", shortCode: "bg", phoneCode: "+359" },
    { name: "Burkina Faso", shortCode: "bf", phoneCode: "+226" },
    { name: "Burundi", shortCode: "bi", phoneCode: "+257" },
    { name: "Cabo Verde", shortCode: "cv", phoneCode: "+238" },
    { name: "Cambodia", shortCode: "kh", phoneCode: "+855" },
    { name: "Cameroon", shortCode: "cm", phoneCode: "+237" },
    { name: "Canada", shortCode: "ca", phoneCode: "+1" },
    { name: "Cayman Islands", shortCode: "ky", phoneCode: "+1-345" },
    { name: "Central African Republic", shortCode: "cf", phoneCode: "+236" },
    { name: "Chad", shortCode: "td", phoneCode: "+235" },
    { name: "Chile", shortCode: "cl", phoneCode: "+56" },
    { name: "China", shortCode: "cn", phoneCode: "+86" },
    { name: "Christmas Island", shortCode: "cx", phoneCode: "+61" },
    { name: "Cocos (Keeling) Islands", shortCode: "cc", phoneCode: "+61" },
    { name: "Colombia", shortCode: "co", phoneCode: "+57" },
    { name: "Comoros", shortCode: "km", phoneCode: "+269" },
    { name: "Congo (DRC)", shortCode: "cd", phoneCode: "+243" },
    { name: "Congo (Republic)", shortCode: "cg", phoneCode: "+242" },
    { name: "Cook Islands", shortCode: "ck", phoneCode: "+682" },
    { name: "Costa Rica", shortCode: "cr", phoneCode: "+506" },
    { name: "Côte d'Ivoire", shortCode: "ci", phoneCode: "+225" },
    { name: "Croatia", shortCode: "hr", phoneCode: "+385" },
    { name: "Cuba", shortCode: "cu", phoneCode: "+53" },
    { name: "Curaçao", shortCode: "cw", phoneCode: "+599" },
    { name: "Cyprus", shortCode: "cy", phoneCode: "+357" },
    { name: "Czechia", shortCode: "cz", phoneCode: "+420" },
    { name: "Denmark", shortCode: "dk", phoneCode: "+45" },
    { name: "Djibouti", shortCode: "dj", phoneCode: "+253" },
    { name: "Dominica", shortCode: "dm", phoneCode: "+1-767" },
    { name: "Dominican Republic", shortCode: "do", phoneCode: "+1-809" },
    { name: "Ecuador", shortCode: "ec", phoneCode: "+593" },
    { name: "Egypt", shortCode: "eg", phoneCode: "+20" },
    { name: "El Salvador", shortCode: "sv", phoneCode: "+503" },
    { name: "Equatorial Guinea", shortCode: "gq", phoneCode: "+240" },
    { name: "Eritrea", shortCode: "er", phoneCode: "+291" },
    { name: "Estonia", shortCode: "ee", phoneCode: "+372" },
    { name: "Eswatini", shortCode: "sz", phoneCode: "+268" },
    { name: "Ethiopia", shortCode: "et", phoneCode: "+251" },
    { name: "Falkland Islands (Malvinas)", shortCode: "fk", phoneCode: "+500" },
    { name: "Faroe Islands", shortCode: "fo", phoneCode: "+298" },
    { name: "Fiji", shortCode: "fj", phoneCode: "+679" },
    { name: "Finland", shortCode: "fi", phoneCode: "+358" },
    { name: "France", shortCode: "fr", phoneCode: "+33" },
    { name: "French Guiana", shortCode: "gf", phoneCode: "+594" },
    { name: "French Polynesia", shortCode: "pf", phoneCode: "+689" },
    { name: "Gabon", shortCode: "ga", phoneCode: "+241" },
    { name: "Gambia", shortCode: "gm", phoneCode: "+220" },
    { name: "Georgia", shortCode: "ge", phoneCode: "+995" },
    { name: "Germany", shortCode: "de", phoneCode: "+49" },
    { name: "Ghana", shortCode: "gh", phoneCode: "+233" },
    { name: "Gibraltar", shortCode: "gi", phoneCode: "+350" },
    { name: "Greece", shortCode: "gr", phoneCode: "+30" },
    { name: "Greenland", shortCode: "gl", phoneCode: "+299" },
    { name: "Grenada", shortCode: "gd", phoneCode: "+1-473" },
    { name: "Guadeloupe", shortCode: "gp", phoneCode: "+590" },
    { name: "Guam", shortCode: "gu", phoneCode: "+1-671" },
    { name: "Guatemala", shortCode: "gt", phoneCode: "+502" },
    { name: "Guernsey", shortCode: "gg", phoneCode: "+44-1481" },
    { name: "Guinea", shortCode: "gn", phoneCode: "+224" },
    { name: "Guinea-Bissau", shortCode: "gw", phoneCode: "+245" },
    { name: "Guyana", shortCode: "gy", phoneCode: "+592" },
    { name: "Haiti", shortCode: "ht", phoneCode: "+509" },
    { name: "Honduras", shortCode: "hn", phoneCode: "+504" },
    { name: "Hong Kong", shortCode: "hk", phoneCode: "+852" },
    { name: "Hungary", shortCode: "hu", phoneCode: "+36" },
    { name: "Iceland", shortCode: "is", phoneCode: "+354" },
    { name: "India", shortCode: "in", phoneCode: "+91" },
    { name: "Indonesia", shortCode: "id", phoneCode: "+62" },
    { name: "Iran", shortCode: "ir", phoneCode: "+98" },
    { name: "Iraq", shortCode: "iq", phoneCode: "+964" },
    { name: "Ireland", shortCode: "ie", phoneCode: "+353" },
    { name: "Isle of Man", shortCode: "im", phoneCode: "+44-1624" },
    { name: "Israel", shortCode: "il", phoneCode: "+972" },
    { name: "Italy", shortCode: "it", phoneCode: "+39" },
    { name: "Jamaica", shortCode: "jm", phoneCode: "+1-876" },
    { name: "Japan", shortCode: "jp", phoneCode: "+81" },
    { name: "Jersey", shortCode: "je", phoneCode: "+44-1534" },
    { name: "Jordan", shortCode: "jo", phoneCode: "+962" },
    { name: "Kazakhstan", shortCode: "kz", phoneCode: "+7" },
    { name: "Kenya", shortCode: "ke", phoneCode: "+254" },
    { name: "Kiribati", shortCode: "ki", phoneCode: "+686" },
    { name: "Kuwait", shortCode: "kw", phoneCode: "+965" },
    { name: "Kyrgyzstan", shortCode: "kg", phoneCode: "+996" },
    { name: "Laos", shortCode: "la", phoneCode: "+856" },
    { name: "Latvia", shortCode: "lv", phoneCode: "+371" },
    { name: "Lebanon", shortCode: "lb", phoneCode: "+961" },
    { name: "Lesotho", shortCode: "ls", phoneCode: "+266" },
    { name: "Liberia", shortCode: "lr", phoneCode: "+231" },
    { name: "Libya", shortCode: "ly", phoneCode: "+218" },
    { name: "Liechtenstein", shortCode: "li", phoneCode: "+423" },
    { name: "Lithuania", shortCode: "lt", phoneCode: "+370" },
    { name: "Luxembourg", shortCode: "lu", phoneCode: "+352" },
    { name: "Macao", shortCode: "mo", phoneCode: "+853" },
    { name: "Madagascar", shortCode: "mg", phoneCode: "+261" },
    { name: "Malawi", shortCode: "mw", phoneCode: "+265" },
    { name: "Malaysia", shortCode: "my", phoneCode: "+60" },
    { name: "Maldives", shortCode: "mv", phoneCode: "+960" },
    { name: "Mali", shortCode: "ml", phoneCode: "+223" },
    { name: "Malta", shortCode: "mt", phoneCode: "+356" },
    { name: "Marshall Islands", shortCode: "mh", phoneCode: "+692" },
    { name: "Martinique", shortCode: "mq", phoneCode: "+596" },
    { name: "Mauritania", shortCode: "mr", phoneCode: "+222" },
    { name: "Mauritius", shortCode: "mu", phoneCode: "+230" },
    { name: "Mayotte", shortCode: "yt", phoneCode: "+262" },
    { name: "Mexico", shortCode: "mx", phoneCode: "+52" },
    { name: "Micronesia", shortCode: "fm", phoneCode: "+691" },
    { name: "Moldova", shortCode: "md", phoneCode: "+373" },
    { name: "Monaco", shortCode: "mc", phoneCode: "+377" },
    { name: "Mongolia", shortCode: "mn", phoneCode: "+976" },
    { name: "Montenegro", shortCode: "me", phoneCode: "+382" },
    { name: "Montserrat", shortCode: "ms", phoneCode: "+1-664" },
    { name: "Morocco", shortCode: "ma", phoneCode: "+212" },
    { name: "Mozambique", shortCode: "mz", phoneCode: "+258" },
    { name: "Myanmar", shortCode: "mm", phoneCode: "+95" },
    { name: "Namibia", shortCode: "na", phoneCode: "+264" },
    { name: "Nauru", shortCode: "nr", phoneCode: "+674" },
    { name: "Nepal", shortCode: "np", phoneCode: "+977" },
    { name: "Netherlands", shortCode: "nl", phoneCode: "+31" },
    { name: "New Caledonia", shortCode: "nc", phoneCode: "+687" },
    { name: "New Zealand", shortCode: "nz", phoneCode: "+64" },
    { name: "Nicaragua", shortCode: "ni", phoneCode: "+505" },
    { name: "Niger", shortCode: "ne", phoneCode: "+227" },
    { name: "Nigeria", shortCode: "ng", phoneCode: "+234" },
    { name: "Niue", shortCode: "nu", phoneCode: "+683" },
    { name: "Norfolk Island", shortCode: "nf", phoneCode: "+672" },
    { name: "North Korea", shortCode: "kp", phoneCode: "+850" },
    { name: "North Macedonia", shortCode: "mk", phoneCode: "+389" },
    { name: "Northern Mariana Islands", shortCode: "mp", phoneCode: "+1-670" },
    { name: "Norway", shortCode: "no", phoneCode: "+47" },
    { name: "Oman", shortCode: "om", phoneCode: "+968" },
    { name: "Pakistan", shortCode: "pk", phoneCode: "+92" },
    { name: "Palau", shortCode: "pw", phoneCode: "+680" },
    { name: "Palestine, State of", shortCode: "ps", phoneCode: "+970" },
    { name: "Panama", shortCode: "pa", phoneCode: "+507" },
    { name: "Papua New Guinea", shortCode: "pg", phoneCode: "+675" },
    { name: "Paraguay", shortCode: "py", phoneCode: "+595" },
    { name: "Peru", shortCode: "pe", phoneCode: "+51" },
    { name: "Philippines", shortCode: "ph", phoneCode: "+63" },
    { name: "Pitcairn Islands", shortCode: "pn", phoneCode: "+64" },
    { name: "Poland", shortCode: "pl", phoneCode: "+48" },
    { name: "Portugal", shortCode: "pt", phoneCode: "+351" },
    { name: "Puerto Rico", shortCode: "pr", phoneCode: "+1-787" },
    { name: "Qatar", shortCode: "qa", phoneCode: "+974" },
    { name: "Réunion", shortCode: "re", phoneCode: "+262" },
    { name: "Romania", shortCode: "ro", phoneCode: "+40" },
    { name: "Russia", shortCode: "ru", phoneCode: "+7" },
    { name: "Rwanda", shortCode: "rw", phoneCode: "+250" },
    { name: "Saint Barthélemy", shortCode: "bl", phoneCode: "+590" },
    { name: "Saint Helena, Ascension and Tristan da Cunha", shortCode: "sh", phoneCode: "+290" },
    { name: "Saint Kitts and Nevis", shortCode: "kn", phoneCode: "+1-869" },
    { name: "Saint Lucia", shortCode: "lc", phoneCode: "+1-758" },
    { name: "Saint Martin (French part)", shortCode: "mf", phoneCode: "+590" },
    { name: "Saint Pierre and Miquelon", shortCode: "pm", phoneCode: "+508" },
    { name: "Saint Vincent and the Grenadines", shortCode: "vc", phoneCode: "+1-784" },
    { name: "Samoa", shortCode: "ws", phoneCode: "+685" },
    { name: "San Marino", shortCode: "sm", phoneCode: "+378" },
    { name: "Sao Tome and Principe", shortCode: "st", phoneCode: "+239" },
    { name: "Saudi Arabia", shortCode: "sa", phoneCode: "+966" },
    { name: "Senegal", shortCode: "sn", phoneCode: "+221" },
    { name: "Serbia", shortCode: "rs", phoneCode: "+381" },
    { name: "Seychelles", shortCode: "sc", phoneCode: "+248" },
    { name: "Sierra Leone", shortCode: "sl", phoneCode: "+232" },
    { name: "Singapore", shortCode: "sg", phoneCode: "+65" },
    { name: "Sint Maarten (Dutch part)", shortCode: "sx", phoneCode: "+1-721" },
    { name: "Slovakia", shortCode: "sk", phoneCode: "+421" },
    { name: "Slovenia", shortCode: "si", phoneCode: "+386" },
    { name: "Solomon Islands", shortCode: "sb", phoneCode: "+677" },
    { name: "Somalia", shortCode: "so", phoneCode: "+252" },
    { name: "South Africa", shortCode: "za", phoneCode: "+27" },
    { name: "South Georgia and the South Sandwich Islands", shortCode: "gs", phoneCode: "+500" },
    { name: "South Korea", shortCode: "kr", phoneCode: "+82" },
    { name: "South Sudan", shortCode: "ss", phoneCode: "+211" },
    { name: "Spain", shortCode: "es", phoneCode: "+34" },
    { name: "Sri Lanka", shortCode: "lk", phoneCode: "+94" },
    { name: "Sudan", shortCode: "sd", phoneCode: "+249" },
    { name: "Suriname", shortCode: "sr", phoneCode: "+597" },
    { name: "Svalbard and Jan Mayen", shortCode: "sj", phoneCode: "+47" },
    { name: "Sweden", shortCode: "se", phoneCode: "+46" },
    { name: "Switzerland", shortCode: "ch", phoneCode: "+41" },
    { name: "Syria", shortCode: "sy", phoneCode: "+963" },
    { name: "Taiwan", shortCode: "tw", phoneCode: "+886" },
    { name: "Tajikistan", shortCode: "tj", phoneCode: "+992" },
    { name: "Tanzania", shortCode: "tz", phoneCode: "+255" },
    { name: "Thailand", shortCode: "th", phoneCode: "+66" },
    { name: "Timor-Leste", shortCode: "tl", phoneCode: "+670" },
    { name: "Togo", shortCode: "tg", phoneCode: "+228" },
    { name: "Tokelau", shortCode: "tk", phoneCode: "+690" },
    { name: "Tonga", shortCode: "to", phoneCode: "+676" },
    { name: "Trinidad and Tobago", shortCode: "tt", phoneCode: "+1-868" },
    { name: "Tunisia", shortCode: "tn", phoneCode: "+216" },
    { name: "Türkiye", shortCode: "tr", phoneCode: "+90" },
    { name: "Turkmenistan", shortCode: "tm", phoneCode: "+993" },
    { name: "Turks and Caicos Islands", shortCode: "tc", phoneCode: "+1-649" },
    { name: "Tuvalu", shortCode: "tv", phoneCode: "+688" },
    { name: "Uganda", shortCode: "ug", phoneCode: "+256" },
    { name: "Ukraine", shortCode: "ua", phoneCode: "+380" },
    { name: "United Arab Emirates", shortCode: "ae", phoneCode: "+971" },
    { name: "United Kingdom", shortCode: "gb", phoneCode: "+44" },
    { name: "United States", shortCode: "us", phoneCode: "+1" },
    { name: "Uruguay", shortCode: "uy", phoneCode: "+598" },
    { name: "Uzbekistan", shortCode: "uz", phoneCode: "+998" },
    { name: "Vanuatu", shortCode: "vu", phoneCode: "+678" },
    { name: "Vatican City", shortCode: "va", phoneCode: "+379" }, // Changed from +39-06 to specific Vatican code
    { name: "Venezuela", shortCode: "ve", phoneCode: "+58" },
    { name: "Vietnam", shortCode: "vn", phoneCode: "+84" },
    { name: "Virgin Islands (British)", shortCode: "vg", phoneCode: "+1-284" },
    { name: "Virgin Islands (U.S.)", shortCode: "vi", phoneCode: "+1-340" },
    { name: "Wallis and Futuna", shortCode: "wf", phoneCode: "+681" },
    { name: "Western Sahara", shortCode: "eh", phoneCode: "+212" },
    { name: "Yemen", shortCode: "ye", phoneCode: "+967" },
    { name: "Zambia", shortCode: "zm", phoneCode: "+260" },
    { name: "Zimbabwe", shortCode: "zw", phoneCode: "+263" },
  ];
}
