import { DestroyRef, Directive, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { COMMENT_EDITOR, CommentEditor } from '../types';
import { LinkDialog } from '../link/link.dialog';

@Directive({
  selector: '[emrCommentEditorCommandLink]',
  standalone: true,
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleLink')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('link')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandLinkDirective {
  private _destroyRef = inject(DestroyRef);
  private _dialog = inject(MatDialog);
  protected commentEditor = inject<CommentEditor>(COMMENT_EDITOR);
  protected setLinkActive = false;

  protected onClick(): void {
    this.setLinkActive = true;
    const dialogRef = this._dialog.open(LinkDialog, {
      data: {
        linkUrl: (this.commentEditor.api.editor().getAttributes('link') as HTMLLinkElement).href
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((linkUrl: string) => {
        this.setLinkActive = false;

        if (typeof linkUrl === 'undefined') {
          return;
        }

        this._setLink(linkUrl);
      })
    ;
  }

  private _setLink(url: string): void {
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      this.commentEditor.api.editor()
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()
      ;
      return;
    }

    // update link
    this.commentEditor.api.editor()
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
    ;
  }
}
