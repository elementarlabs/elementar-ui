import { Directive } from '@angular/core';

@Directive({
  selector: '[emrDrawerIgnoreOutsideClick]',
  host: {
    'class': 'emr-drawer-ignore-outside-click'
  }
})
export class DrawerIgnoreOutsideClickDirective {
}
