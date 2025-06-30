import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrUploadAreaInvalidState]'
})
export class UploadAreaInvalidStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
