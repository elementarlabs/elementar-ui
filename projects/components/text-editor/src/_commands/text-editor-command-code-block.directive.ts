import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[emrTextEditorCommandCodeBlock]',
  exportAs: 'emrTextEditorCommandCodeBlock',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleCodeBlock')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('codeBlock')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandCodeBlockDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleCodeBlock');
  }
}
