import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, CommentEditor } from '../types';

@Directive({
  selector: '[emrCommentEditorCommandOrderedList]',
  standalone: true,
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleOrderedList')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('orderedList')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandOrderedListDirective {
  protected commentEditor = inject<CommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.runCommand('toggleOrderedList');
  }
}
