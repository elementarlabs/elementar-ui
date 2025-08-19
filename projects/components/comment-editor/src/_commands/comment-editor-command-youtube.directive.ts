import { DestroyRef, Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { COMMENT_EDITOR, CommentEditor } from '../types';
import { YoutubeDialog } from '../youtube/youtube.dialog';

@Directive({
  selector: '[emrCommentEditorCommandYoutube]',
  standalone: true,
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleBlockquote')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('blockquote')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandYoutubeDirective {
  protected commentEditor = inject<CommentEditor>(COMMENT_EDITOR);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);

  protected onClick(): void {
    const dialogRef = this._dialog.open(YoutubeDialog, {
      data: {
        linkUrl: (this.commentEditor.api.editor().getAttributes('iframe') as HTMLIFrameElement).src
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((linkUrl: string) => {
        if (typeof linkUrl === 'undefined') {
          return;
        }

        this.commentEditor.api.editor().commands.setYoutubeVideo({
          src: linkUrl
        });
      })
    ;
  }
}
