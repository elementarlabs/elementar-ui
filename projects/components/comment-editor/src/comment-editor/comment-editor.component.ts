import {
  booleanAttribute, ChangeDetectorRef,
  Component,
  ElementRef, forwardRef,
  inject, Injector,
  input,
  OnDestroy, OnInit,
  output, PLATFORM_ID,
  viewChild,
  DOCUMENT
} from '@angular/core';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import { Blockquote } from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import Code from '@tiptap/extension-code';
import History from '@tiptap/extension-history';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import { MatButton } from '@angular/material/button';
import { isPlatformServer } from '@angular/common';
import { COMMENT_EDITOR, CommentEditorAPI } from '../types';
import ImageUploadingPlaceholderExtension from '../extensions/image-uploading-placeholder';

@Component({
  selector: 'emr-comment-editor',
  exportAs: 'emrCommentEditor',
  imports: [
    MatButton
  ],
  templateUrl: './comment-editor.component.html',
  styleUrl: './comment-editor.component.scss',
  providers: [
    {
      provide: COMMENT_EDITOR,
      useExisting: forwardRef(() => CommentEditorComponent)
    }
  ],
  host: {
    'class': 'emr-comment-editor',
    '[class.full-view]': 'fullView || fullViewMode()',
    '(click)': 'activateFullView()'
  }
})
export class CommentEditorComponent implements OnInit, OnDestroy {
  private _platformId = inject(PLATFORM_ID);
  private _document = inject(DOCUMENT);
  private _cdr = inject(ChangeDetectorRef);
  private _injector = inject(Injector);
  private _content = viewChild.required<ElementRef>('content');
  private _bubbleMenu = viewChild.required<ElementRef>('bubbleMenu');
  private _imageBubbleMenu = viewChild.required<ElementRef>('imageBubbleMenu');
  protected _value = '';
  protected editor: Editor;
  protected showToolbar = false;
  protected fullView = false;

  contentMaxHeight = input<number>();
  buttonCancelLabel = input<string>('Cancel');
  buttonSendLabel = input<string>('Send');
  placeholder = input('Write something …');
  toolbarAlwaysVisible = input(false, {
    transform: booleanAttribute
  });
  fullViewMode = input(false, {
    transform: booleanAttribute
  });
  cancelButtonAlwaysVisible = input(false, {
    transform: booleanAttribute
  });
  imageUploadFn = input<(file: Blob) => Promise<string>>();

  readonly sent = output<string>();
  readonly canceled = output<void>();

  ngOnInit() {
    this._init();
  }

  get api(): CommentEditorAPI {
    return {
      isCommandDisabled: (command: string) => this.isCommandDisabled(command),
      isActive: (command: string) => this.editor?.isActive(command),
      runCommand: (command: string) => this._runCommand(command),
      editor: () => this.editor,
      isToolbarActive: () => this.showToolbar,
      toggleToolbar: () => this.toggleToolbar(),
      isEditorActivated: () => this.fullView || this.fullViewMode()
    }
  }

  isCommandDisabled(command: string): boolean | null {
    if (!this.editor) {
      return true;
    }

    const canFocus = this.editor.can().chain().focus() as any;
    return !canFocus[command]().run() || null;
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

  send(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.sent.emit(this._value);
    this.showToolbar = false;
    this.fullView = false;
    this._value = '';
    this.editor.commands.clearContent(true);
  }

  activateFullView(): void {
    if (this.fullView) {
      return;
    }

    this.fullView = true;
  }

  toggleToolbar(): void {
    this.showToolbar = !this.showToolbar;
  }

  cancel(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.showToolbar = false;
    this.fullView = false;
    this._value = '';
    this.editor.commands.clearContent(true);
    this.canceled.emit();
  }

  private _runCommand(command: string): void {
    if (!this.editor) {
      return;
    }

    const chainFocus = this.editor.chain().focus() as any;
    chainFocus[command]().run();
  }

  private _init(): void {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    this.editor = new Editor({
      element: this._content().nativeElement,
      extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Strike,
        Blockquote,
        CodeBlock,
        BulletList,
        OrderedList,
        ListItem,
        Code,
        History,
        Dropcursor,
        Youtube.configure({
          controls: false,
          nocookie: true,
        }),
        ImageUploadingPlaceholderExtension(this._injector, {
          uploadFn: this.imageUploadFn(),
        }),
        Image.configure({
          inline: true,
          allowBase64: true
        }),
        Link.configure({
          openOnClick: false,
          defaultProtocol: 'https',
        }),
        Placeholder.configure({
          placeholder: this.placeholder()
        }),
        // FloatingMenu.configure({
        //   element: this._floatingMenu().nativeElement
        // }),
        BubbleMenu.configure({
          element: this._imageBubbleMenu().nativeElement,
          shouldShow: ({ editor, view, state, oldState, from, to }) => {
            // return editor.isActive('image');
            return false;
          },
        }),
        BubbleMenu.configure({
          element: this._bubbleMenu().nativeElement,
          tippyOptions: {
            appendTo: this._document.body,
            zIndex: 999
          },
          shouldShow: ({ editor, view, state, oldState, from, to }) => {
            return !editor.isActive('image') &&
              !editor.isActive('youtube') &&
              !editor.isActive('imageUploadingPlaceholder') &&
              !editor.view.state.selection.empty
            ;
          },
        })
      ],
      content: '',
      onUpdate: ({ editor }) => {
        this._value = !editor.isEmpty ? editor.getHTML() : '';
      }
    });
    this._cdr.detectChanges();
  }
}
