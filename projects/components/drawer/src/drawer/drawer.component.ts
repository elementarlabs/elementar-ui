import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  effect,
  ElementRef,
  inject,
  Renderer2,
  WritableSignal,
  signal,
  computed,
  Signal,
  DOCUMENT, forwardRef,
} from '@angular/core';
import { DRAWER } from '../types';

@Component({
  selector: 'emr-drawer',
  exportAs: 'emrDrawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  providers: [
    {
      provide: DRAWER,
      useExisting: forwardRef(() => DrawerComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-drawer',
    '[class.no-backdrop]': '_isOpen() && !showBackdrop()',
    '(document:keydown.escape)': 'onKeydownHandler($event)',
    '(document:click)': 'onDocumentClickHandler($event)'
  }
})
export class DrawerComponent {
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);

  readonly initialIsOpen = input<boolean | undefined>(undefined, { alias: 'isOpen' });
  readonly showBackdrop = input(true);

  readonly closed = output<void>();
  readonly opened = output<void>();

  private internalIsOpen: WritableSignal<boolean> = signal(false);
  private drawerContainerElement: HTMLElement | null = null;
  private previousInternalIsOpenState: WritableSignal<boolean | undefined> = signal(undefined);
  private justOpenedWithoutBackdrop = signal(false); // Новый флаг

  protected _isOpen: Signal<boolean> = computed(() => this.internalIsOpen());

  constructor() {
    effect(() => {
      const externalIsOpen = this.initialIsOpen();
      if (externalIsOpen !== undefined) {
        this.internalIsOpen.set(externalIsOpen);
      }
    });

    effect(() => {
      const currentInternalOpen = this.internalIsOpen();
      const previousInternalOpen = this.previousInternalIsOpenState();
      const backdropActive = this.showBackdrop();

      if (currentInternalOpen) {
        if (backdropActive) {
          this.renderer.addClass(this.document.body, 'overflow-hidden');
        }
        if (currentInternalOpen && !previousInternalOpen) {
          this.opened.emit();
          Promise.resolve().then(() => {
            this.justOpenedWithoutBackdrop.set(true);
          });
        }
      } else {
        this.renderer.removeClass(this.document.body, 'overflow-hidden');
      }
      this.previousInternalIsOpenState.set(currentInternalOpen);
    });
  }

  private getDrawerContainer(): HTMLElement | null {
    if (!this.drawerContainerElement) {
      this.drawerContainerElement = this.elementRef.nativeElement.querySelector('.drawer-container');
    }
    return this.drawerContainerElement;
  }

  open(): void {
    if (!this.internalIsOpen()) {
      this.internalIsOpen.set(true);
    }
  }

  close(): void {
    if (this.internalIsOpen()) {
      this.internalIsOpen.set(false);
      this.justOpenedWithoutBackdrop.set(false);
      this.closed.emit();
    }
  }

  get isOpened(): boolean {
    return this._isOpen();
  }

  protected onKeydownHandler(event: Event): void {
    if (this._isOpen()) {
      this.close();
    }
  }

  protected onDocumentClickHandler(event: MouseEvent): void {
    if (!this._isOpen() || this.showBackdrop() || !this.justOpenedWithoutBackdrop()) {
      return;
    }

    const target = event.target as HTMLElement;

    if (
      target.classList.contains('.emr-drawer-ignore-outside-click') ||
      target.closest('.emr-drawer-ignore-outside-click')
    ) {
      return;
    }

    this.internalIsOpen.set(true);
    const clickedElement = event.target as Node;
    const drawerContainer = this.getDrawerContainer();

    if (drawerContainer && !drawerContainer.contains(clickedElement)) {
      this.close();
    }
  }
}
