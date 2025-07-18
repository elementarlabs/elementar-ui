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
  DOCUMENT
} from '@angular/core';


@Component({
  selector: 'emr-drawer',
  exportAs: 'emrDrawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.no-backdrop]': '_isOpen() && !showBackdrop()',
    '(document:keydown.escape)': 'onKeydownHandler($event)',
    '(document:click)': 'onDocumentClickHandler($event)'
  }
})
export class DrawerComponent {
  initialIsOpen = input<boolean | undefined>(undefined, { alias: 'isOpen' });
  showBackdrop = input(true);

  closed = output<void>();
  opened = output<void>();

  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);

  private internalIsOpen: WritableSignal<boolean> = signal(false);
  private drawerContainerElement: HTMLElement | null = null;
  private previousInternalIsOpenState: WritableSignal<boolean | undefined> = signal(undefined);
  private justOpenedWithoutBackdrop = signal(false); // Новый флаг

  public _isOpen: Signal<boolean> = computed(() => this.internalIsOpen());

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

  protected onKeydownHandler(event: KeyboardEvent): void {
    if (this._isOpen()) {
      this.close();
    }
  }

  protected onDocumentClickHandler(event: MouseEvent): void {
    if (!this._isOpen() || this.showBackdrop() || !this.justOpenedWithoutBackdrop()) {
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
