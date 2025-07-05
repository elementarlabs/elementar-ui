import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrColorSchemeDark]'
})
export class ColorSchemeDarkDirective {
  readonly templateRef = inject(TemplateRef);
}
