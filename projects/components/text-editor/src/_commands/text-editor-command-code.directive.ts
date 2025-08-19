import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[emrTextEditorCommandCode]',
  exportAs: 'emrTextEditorCommandCode',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleCode')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('code')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandCodeDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleCode');
  }
}
