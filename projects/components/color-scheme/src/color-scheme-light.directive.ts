import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrColorSchemeLight]'
})
export class ColorSchemeLightDirective {
  readonly templateRef = inject(TemplateRef);
}
