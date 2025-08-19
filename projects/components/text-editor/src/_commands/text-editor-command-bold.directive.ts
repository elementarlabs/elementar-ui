import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[emrTextEditorCommandBold]',
  exportAs: 'emrTextEditorCommandBold',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleBold')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('bold')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandBoldDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleBold');
  }
}
