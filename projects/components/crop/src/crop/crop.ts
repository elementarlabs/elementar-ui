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
  topPx: number;
  rightPx: number;
  bottomPx: number;
  leftPx: number;
  topPct: number;
  rightPct: number;
  bottomPct: number;
  leftPct: number;
  widthPx: number;
  heightPx: number;
  containerWidth: number;
  containerHeight: number;
}

interface CropInset {
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
  minWidth = input(100);
  minHeight = input(100);
  shape = input<'rectangle' | 'circle'>('rectangle');

  readonly selectionApplied = output<CropSelection>();

  isCircle = computed(() => this.shape() === 'circle');
  selection = signal<CropInset>({ top: 20, right: 20, bottom: 20, left: 20 });

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private activeDragHandle = signal<DragHandle | null>(null);
  private startDragPosition = signal<{ x: number; y: number } | null>(null);
  private startDragSelection = signal<CropInset | null>(null);

  constructor() {
    effect(() => {
      if (this.isCircle() && this.elementRef.nativeElement.isConnected) {
        this.resetSelectionToSquare();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isCircle()) {
      const hostEl = this.elementRef.nativeElement;
      if (hostEl.offsetWidth > 0) {
        this.resetSelectionToSquare();
      } else {
        const observer = new ResizeObserver(() => {
          if (hostEl.offsetWidth > 0) {
            this.resetSelectionToSquare();
            observer.disconnect();
          }
        });
        observer.observe(hostEl);
      }
    }
  }

  private resetSelectionToSquare(): void {
    const hostEl = this.elementRef.nativeElement;
    const hostWidth = hostEl.offsetWidth;
    const hostHeight = hostEl.offsetHeight;

    if (hostWidth === 0 || hostHeight === 0) return;

    const size = Math.min(hostWidth, hostHeight) * 0.8;
    const left = (hostWidth - size) / 2;
    const top = (hostHeight - size) / 2;

    this.selection.set({
      top: top,
      right: (hostWidth - size) / 2,
      bottom: (hostHeight - size) / 2,
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
    if (!this.activeDragHandle()) {
      return;
    }

    this.activeDragHandle.set(null);
    this.emitSelection();
  }

  private emitSelection(): void {
    const hostEl = this.elementRef.nativeElement;
    const containerWidth = hostEl.offsetWidth;
    const containerHeight = hostEl.offsetHeight;

    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }

    const currentSelection = this.selection();
    const { top: topPx, right: rightPx, bottom: bottomPx, left: leftPx } = currentSelection;

    const widthPx = containerWidth - leftPx - rightPx;
    const heightPx = containerHeight - topPx - bottomPx;

    this.selectionApplied.emit({
      topPx,
      rightPx,
      bottomPx,
      leftPx,
      topPct: (topPx / containerHeight) * 100,
      rightPct: (rightPx / containerWidth) * 100,
      bottomPct: (bottomPx / containerHeight) * 100,
      leftPct: (leftPx / containerWidth) * 100,
      widthPx,
      heightPx,
      containerWidth,
      containerHeight,
    });
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
