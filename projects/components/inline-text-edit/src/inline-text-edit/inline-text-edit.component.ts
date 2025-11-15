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
  OnDestroy,
  afterNextRender, DOCUMENT, numberAttribute, AfterViewInit,
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
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(keydown.enter)': 'onEnter($event)',
    '(keydown.escape)': 'onEscape()',
    '(paste)': 'onPaste($event)',
    '(input)': 'onInput()',
  },
})
export class InlineTextEditComponent implements AfterViewInit, AfterContentChecked, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  enabled = input(true);
  placeholder = input('');
  delay = input(0, {
    transform: numberAttribute
  });

  readonly contentChanged = output<string>();

  isEditing = signal(false);
  isFocused = signal(false);

  private previousValue = '';
  private minHeightSet = false;
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private emitTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      this.setInitialMinHeight();
    });
  }

  ngAfterViewInit() {
    this.previousValue = this.elementRef.nativeElement.textContent;
  }

  get isContentEditable() {
    return true;
  }

  ngAfterContentChecked() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.setInitialMinHeight();
  }

  ngOnDestroy(): void {
    this.clearPendingEmission();
  }

  private setInitialMinHeight(): void {
    if (this.minHeightSet) {
      return;
    }

    const el = this.elementRef.nativeElement;
    let height = el.getBoundingClientRect().height;

    if (!height || height < 1) {
      const cs = getComputedStyle(el);
      let lh = parseFloat(cs.lineHeight);

      if (isNaN(lh) || lh <= 0) {
        const fs = parseFloat(cs.fontSize) || 16;
        lh = fs * 1.5;
      }

      height = lh;
    }

    if (height && height > 0) {
      this.renderer.setStyle(el, 'min-height', `${Math.ceil(height)}px`);
      this.minHeightSet = true;
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
    this.document.execCommand('insertText', false, text);
  }

  onInput(): void {
    this.isEditing.set(true);
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
      this.previousValue = newValue;
      this.emitWithDelay(newValue);
    }

    this.isEditing.set(false);
  }

  private cancelEdit(): void {
    if (!this.isEditing()) {
      return;
    }

    this.elementRef.nativeElement.textContent = this.previousValue;
    // Keep focus and move caret to the end of the restored content for better UX.
    this.placeCaretAtEnd();
    this.isEditing.set(false);
    // Cancel any pending emission since the edit was canceled.
    this.clearPendingEmission();
  }

  private placeCaretAtEnd(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const el = this.elementRef.nativeElement;
    // Ensure the host is focused so caret positioning is visible.
    el.focus();

    const selection = this.document.getSelection?.();
    if (!selection) {
      return;
    }

    const range = this.document.createRange();
    range.selectNodeContents(el);
    range.collapse(false); // collapse to end
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private emitWithDelay(value: string): void {
    const d = this.delay();
    // Always clear a previous scheduled emission to ensure only the latest value is emitted
    this.clearPendingEmission();

    if (d > 0) {
      this.emitTimeoutId = setTimeout(() => {
        this.emitTimeoutId = null;
        this.contentChanged.emit(value);
      }, d);
    } else {
      this.contentChanged.emit(value);
    }
  }

  private clearPendingEmission(): void {
    if (this.emitTimeoutId) {
      clearTimeout(this.emitTimeoutId);
      this.emitTimeoutId = null;
    }
  }
}
