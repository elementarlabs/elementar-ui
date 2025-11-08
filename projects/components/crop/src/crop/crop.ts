import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface CropSelection {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

type DragHandle =
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  | 'top' | 'right' | 'bottom' | 'left'
  | 'move';

@Component({
  selector: 'emr-crop',
  templateUrl: './crop.html',
  styleUrl: './crop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:mouseup)': 'onDragEnd()',
    '(document:mousemove)': 'onDrag($event)',
  },
})
export class Crop implements AfterViewInit {
  minWidth = input(20);
  minHeight = input(20);
  shape = input<'rectangle' | 'circle'>('rectangle');
  selectionApplied = output<CropSelection>();

  isCircle = computed(() => this.shape() === 'circle');
  selection = signal<CropSelection>({ top: 20, right: 20, bottom: 20, left: 20 });

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private activeDragHandle = signal<DragHandle | null>(null);
  private startDragPosition = signal<{ x: number; y: number } | null>(null);
  private startDragSelection = signal<CropSelection | null>(null);

  constructor() {
    effect(() => {
      // Handles dynamic changes of the `shape` input after initialization.
      if (this.isCircle() && this.elementRef.nativeElement.offsetWidth > 0) {
        this.resetSelectionToSquare();
      }
    });
  }

  ngAfterViewInit(): void {
    // Handles the initial case when the component loads with shape="circle".
    if (this.isCircle()) {
      this.resetSelectionToSquare();
    }
  }

  private resetSelectionToSquare(): void {
    const hostEl = this.elementRef.nativeElement;
    const hostWidth = hostEl.offsetWidth;
    const hostHeight = hostEl.offsetHeight;

    // Center a square that is 80% of the smallest dimension.
    const size = Math.min(hostWidth, hostHeight) * 0.8;
    const left = (hostWidth - size) / 2;
    const top = (hostHeight - size) / 2;

    this.selection.set({
      top: top,
      right: left,
      bottom: top,
      left: left,
    });
  }

  selectionStyle = computed(() => ({
    top: `${this.selection().top}px`,
    right: `${this.selection().right}px`,
    bottom: `${this.selection().bottom}px`,
    left: `${this.selection().left}px`,
  }));

  onDragStart(event: MouseEvent, handle: DragHandle): void {
    event.preventDefault();
    event.stopPropagation();
    this.activeDragHandle.set(handle);
    this.startDragPosition.set({ x: event.clientX, y: event.clientY });
    this.startDragSelection.set(this.selection());
  }

  onDragEnd(): void {
    this.activeDragHandle.set(null);
  }

  onDrag(event: MouseEvent): void {
    const handle = this.activeDragHandle();
    if (!handle) return;

    const startPos = this.startDragPosition()!;
    const startSelection = this.startDragSelection()!;
    const dx = event.clientX - startPos.x;
    const dy = event.clientY - startPos.y;
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();

    this.selection.update(() => {
      const newSelection = { ...startSelection };

      if (handle === 'move') {
        const selectionWidth = hostRect.width - startSelection.left - startSelection.right;
        const selectionHeight = hostRect.height - startSelection.top - startSelection.bottom;
        newSelection.top = Math.max(0, Math.min(startSelection.top + dy, hostRect.height - selectionHeight));
        newSelection.left = Math.max(0, Math.min(startSelection.left + dx, hostRect.width - selectionWidth));
        newSelection.bottom = hostRect.height - newSelection.top - selectionHeight;
        newSelection.right = hostRect.width - newSelection.left - selectionWidth;
        return newSelection;
      }

      let currentDx = dx;
      let currentDy = dy;

      if (this.isCircle() && handle.includes('-')) {
        if (handle === 'top-left' || handle === 'bottom-right') {
          currentDy = currentDx;
        } else {
          currentDy = -currentDx;
        }
      }

      if (handle.includes('top')) newSelection.top = startSelection.top + currentDy;
      if (handle.includes('bottom')) newSelection.bottom = startSelection.bottom - currentDy;
      if (handle.includes('left')) newSelection.left = startSelection.left + currentDx;
      if (handle.includes('right')) newSelection.right = startSelection.right - currentDx;

      const minW = this.minWidth();
      const minH = this.isCircle() ? minW : this.minHeight();

      if (hostRect.width - newSelection.left - newSelection.right < minW) {
        if (handle.includes('left')) newSelection.left = hostRect.width - newSelection.right - minW;
        else newSelection.right = hostRect.width - newSelection.left - minW;
      }
      if (hostRect.height - newSelection.top - newSelection.bottom < minH) {
        if (handle.includes('top')) newSelection.top = hostRect.height - newSelection.bottom - minH;
        else newSelection.bottom = hostRect.height - newSelection.top - minH;
      }

      newSelection.top = Math.max(0, newSelection.top);
      newSelection.bottom = Math.max(0, newSelection.bottom);
      newSelection.left = Math.max(0, newSelection.left);
      newSelection.right = Math.max(0, newSelection.right);

      return newSelection;
    });
  }
}
