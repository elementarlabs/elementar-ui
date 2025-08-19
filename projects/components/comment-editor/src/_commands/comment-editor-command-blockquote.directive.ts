import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, CommentEditor } from '../types';

@Directive({
  selector: '[emrCommentEditorCommandBlockquote]',
  standalone: true,
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleBlockquote')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('blockquote')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandBlockquoteDirective {
  protected commentEditor = inject<CommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.runCommand('toggleBlockquote');
  }
}
