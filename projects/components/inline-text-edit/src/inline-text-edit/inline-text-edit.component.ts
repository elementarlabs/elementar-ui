import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'emr-inline-text-edit,[emr-inline-text-edit]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inline-text-edit.component.html',
  styleUrl: './inline-text-edit.component.scss',
  host: {
    'class': 'emr-inline-text-edit',
    '[attr.contenteditable]': 'isContentEditable',
    '[class.editing]': 'isEditing()',
    '[class.focused]': 'isFocused()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(keydown.enter)': 'onEnter($event)',
    '(keydown.escape)': 'onEscape()',
  },
})
export class InlineTextEditComponent {
  public enabled = input(true);
  public changed = output<string>();

  public isEditing = signal(false);
  public isFocused = signal(false);
  private previousValue: string = '';
  private elementRef = inject(ElementRef<HTMLElement>);

  get isContentEditable() {
    return this.enabled() && this.isEditing();
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

  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.finishEdit();
  }

  onEscape(): void {
    this.cancelEdit();
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
