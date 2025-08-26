import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  Renderer2,
  PLATFORM_ID,
  AfterContentChecked,
  afterNextRender,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'emr-inline-text-edit,[emr-inline-text-edit]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inline-text-edit.component.html',
  styleUrl: './inline-text-edit.component.scss',
  host: {
    'class': 'emr-inline-text-edit',
    '[attr.contenteditable]': 'isContentEditable',
    '[attr.data-placeholder]': 'placeholder()',
    '[class.editing]': 'isEditing()',
    '[class.focused]': 'isFocused()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(keydown.enter)': 'onEnter($event)',
    '(keydown.escape)': 'onEscape()',
    '(paste)': 'onPaste($event)',
    '(input)': 'onInput()',
  },
})
export class InlineTextEditComponent implements AfterContentChecked {
  private platformId = inject(PLATFORM_ID);

  enabled = input(true);
  placeholder = input('');

  readonly changed = output<string>();

  isEditing = signal(false);
  isFocused = signal(false);

  private previousValue: string = '';
  private minHeightSet = false;
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  constructor() {
    afterNextRender(() => {
      this.setInitialMinHeight();
    });
  }

  get isContentEditable() {
    return this.enabled() && this.isEditing();
  }

  ngAfterContentChecked() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.setInitialMinHeight();
  }

  private setInitialMinHeight(): void {
    if (this.minHeightSet) {
      return;
    }

    const el = this.elementRef.nativeElement;
    let height = el.getBoundingClientRect().height;

    if (height && height > 0) {
      this.renderer.setStyle(el, 'min-height', `${Math.ceil(height)}px`);
      this.minHeightSet = true;
    }
  }

  onMouseEnter(): void {
    if (!this.enabled() || this.isEditing()) {
      return;
    }

    this.previousValue = this.elementRef.nativeElement.textContent?.trim() ?? '';
    this.isEditing.set(true);
  }

  onMouseLeave(): void {
    if (!this.isFocused()) {
      this.isEditing.set(false);
    }
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.finishEdit();
  }

  onEnter(event: Event): void {
    event.preventDefault();
    this.finishEdit();
  }

  onEscape(): void {
    this.cancelEdit();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') ?? '';
    document.execCommand('insertText', false, text);
  }

  onInput(): void {
    // Track live changes and normalize empty content.
    // Browsers may insert a <br> (or wrappers like <div><br></div>) in empty contenteditable elements.
    const el = this.elementRef.nativeElement;
    const html = (el.innerHTML ?? '').trim().toLowerCase();
    const text = (el.textContent ?? '').trim();

    const isEffectivelyEmpty =
      text.length === 0 ||
      html === '' ||
      html === '<br>' ||
      html === '<br/>' ||
      html === '<div><br></div>';

    if (isEffectivelyEmpty && el.innerHTML !== '') {
      // Clear to a truly empty state so placeholders and styling work correctly.
      el.innerHTML = '';
    }
  }

  private finishEdit(): void {
    if (!this.isEditing()) {
      return;
    }

    const newValue = this.elementRef.nativeElement.textContent?.trim() ?? '';

    if (newValue !== this.previousValue) {
      this.changed.emit(newValue);
    }

    this.isEditing.set(false);
  }

  private cancelEdit(): void {
    if (!this.isEditing()) {
      return;
    }

    this.elementRef.nativeElement.textContent = this.previousValue;
    this.isEditing.set(false);
  }
}
