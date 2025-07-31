import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'password-strength',
    loadChildren: () => import('./password-strength/password-strength.module').then(m => m.PasswordStrengthModule)
  },
  {
    path: 'autocomplete',
    loadChildren: () => import('./autocomplete/autocomplete.module').then(m => m.AutocompleteModule)
  },
  {
    path: 'buttons',
    loadChildren: () => import('./buttons/buttons.module').then(m => m.ButtonsModule)
  },
  {
    path: 'input',
    loadChildren: () => import('./input/input.module').then(m => m.InputModule)
  },
  {
    path: 'phone-input',
    loadChildren: () => import('./phone-input/phone-input.module').then(m => m.PhoneInputModule)
  },
  {
    path: 'slide-toggle',
    loadChildren: () => import('./slide-toggle/slide-toggle.module').then(m => m.SlideToggleModule)
  },
  {
    path: 'checkbox',
    loadChildren: () => import('./checkbox/checkbox.module').then(m => m.CheckboxModule)
  },
  {
    path: 'radio',
    loadChildren: () => import('./radio/radio.module').then(m => m.RadioModule)
  },
  {
    path: 'select',
    loadChildren: () => import('./select/select.module').then(m => m.SelectModule)
  },
  {
    path: 'segmented',
    loadChildren: () => import('./segmented/segmented.module').then(m => m.SegmentedModule)
  },
  {
    path: 'pin-input',
    loadChildren: () => import('./pin-input/pin-input.module').then(m => m.PinInputModule)
  },
  {
    path: 'button-toggle',
    loadChildren: () => import('./button-toggle/button-toggle.module').then(m => m.ButtonToggleModule)
  },
  {
    path: 'number-input',
    loadChildren: () => import('./number-input/number-input.module').then(m => m.NumberInputModule)
  },
  {
    path: 'country',
    loadChildren: () => import('./country/country.module').then(m => m.CountryModule)
  },
  {
    path: 'timezone',
    loadChildren: () => import('./timezone/timezone.module').then(m => m.TimezoneModule)
  },
  {
    path: 'form-renderer',
    loadChildren: () => import('./form-renderer/form-renderer.module').then(m => m.FormRendererModule)
  },
  {
    path: 'inline-text-edit',
    loadChildren: () => import('./inline-text-edit/inline-text-edit.module').then(m => m.InlineTextEditModule)
  },
  {
    path: 'currency-select',
    loadChildren: () => import('./currency-select/currency-select.module').then(m => m.CurrencySelectModule)
  },
  {
    path: 'input-mask',
    loadChildren: () => import('./input-mask/input-mask.module').then(m => m.InputMaskModule)
  },
  {
    path: 'input-validator',
    loadChildren: () => import('./input-validator/input-validator.module').then(m => m.InputValidatorModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
