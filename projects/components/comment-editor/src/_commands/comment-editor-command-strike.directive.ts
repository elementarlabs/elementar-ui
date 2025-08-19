import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, CommentEditor } from '../types';

@Directive({
  selector: '[emrCommentEditorCommandStrike]',
  standalone: true,
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleStrike')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('strike')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandStrikeDirective {
  protected commentEditor = inject<CommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.runCommand('toggleStrike');
  }
}
