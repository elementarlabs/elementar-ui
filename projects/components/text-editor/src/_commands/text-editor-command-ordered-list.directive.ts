import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[emrTextEditorCommandOrderedList]',
  exportAs: 'emrTextEditorCommandOrderedList',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleOrderedList')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('orderedList')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandOrderedListDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleOrderedList');
  }
}
