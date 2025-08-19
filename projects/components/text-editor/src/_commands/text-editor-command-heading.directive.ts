import { Directive, inject, input, numberAttribute } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[emrTextEditorCommandHeading]',
  exportAs: 'emrTextEditorCommandHeading',
  host: {
    '[attr.disabled]': `isDisabled ? '' : null`,
    '[class.active]': `isActive`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandHeadingDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  level = input.required({
    transform: numberAttribute
  });

  protected get isActive(): boolean {
    return !!(this.textEditor && this.textEditor.api.isActive('heading', { level: this.level() }));
  }

  protected get isDisabled(): boolean {
    return !!(this.textEditor && this.textEditor.api.isCommandDisabled('toggleHeading', { level: this.level() }));
  }

  protected onClick() {
    this.textEditor.api.runCommand('toggleHeading', { level: this.level() });
  }
}
