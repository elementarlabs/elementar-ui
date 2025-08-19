import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[emrTextEditorCommandItalic]',
  exportAs: 'emrTextEditorCommandItalic',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleItalic')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('italic')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandItalicDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleItalic');
  }
}
