import {
  Component,
  ElementRef,
  signal,
  viewChild,
  afterNextRender,
  effect,
  input,
  output,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  PLATFORM_ID, model,
  DOCUMENT
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subscription, merge, Subject } from 'rxjs';
import { switchMap, takeUntil, map, filter, tap } from 'rxjs/operators';
import { Point } from '../lazy-point';
import { LazyBrush, LazyBrushOptions } from '../lazy-brush';
import { BrandColorsComponent } from '@elementar-ui/components/brand-colors';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'emr-signature-pad',
  exportAs: 'emrSignaturePad',
  standalone: true,
  imports: [
    BrandColorsComponent,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './signature-pad.component.html',
  styleUrl: './signature-pad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-signature-pad',
    '(document:keydown.escape)': 'handleEscapeKey($event)',
  }
})
export class SignaturePadComponent implements OnDestroy {
  penColor = model<string>('#000');
  lineWidth = input<number>(4);
  backgroundColor = input<string>('transparent');
  lazyRadius = input<number>(3);
  lazyFriction = input<number>(0.1);
  lazyEnabled = input<boolean>(true);
  colors = input<string[]>(['#000', '#0059ff', '#ff0000']);

  signatureSaved = output<string>();
  signatureCleared = output<void>();

  mainCanvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('signatureCanvas');

  private canvasWidth = signal<number>(400);
  private canvasHeight = signal<number>(200);

  private mainContext = signal<CanvasRenderingContext2D | null>(null);
  private memoryCanvasElement: HTMLCanvasElement | null = null;
  private memoryContext = signal<CanvasRenderingContext2D | null>(null);
  private lazyBrushInstance!: LazyBrush;
  private isDrawing = signal(false);
  private currentStrokePoints = signal<Point[]>([]);

  private resizeObserver!: ResizeObserver;
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  private subscriptions: Subscription[] = [];
  private pointerDown$ = new Subject<Point>();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.initializeLazyBrush();
        this.initializeCanvasesAndContexts();
        this.setupResizeObserver();
        this.setupPointerEvents();
      });
    }

    effect(() => {
      const currentWidth = this.canvasWidth();
      const currentHeight = this.canvasHeight();
      this.backgroundColor();
      if (this.mainContext() && this.memoryContext() && this.mainCanvasRef() && this.memoryCanvasElement && this.lazyBrushInstance) {
        const mainCanvasEl = this.mainCanvasRef().nativeElement;
        mainCanvasEl.width = currentWidth;
        mainCanvasEl.height = currentHeight;
        this.memoryCanvasElement.width = currentWidth;
        this.memoryCanvasElement.height = currentHeight;
        this.configureContextStyling(this.mainContext()!);
        this.configureContextStyling(this.memoryContext()!);
        this.mainContext()!.fillStyle = this.backgroundColor();
        this.mainContext()!.fillRect(0, 0, currentWidth, currentHeight);
        this.memoryContext()!.clearRect(0,0, currentWidth, currentHeight);
        this.currentStrokePoints.set([]);
        this.lazyBrushInstance.pointer.update({x:0, y:0});
        this.lazyBrushInstance.brush.update({x:0, y:0});
      }
    });

    effect(() => {
      this.penColor(); this.lineWidth();
      if (this.mainContext()) {
        this.mainContext()!.strokeStyle = this.penColor();
        this.mainContext()!.lineWidth = this.lineWidth();
        this.mainContext()!.fillStyle = this.penColor();
      }
      if (this.memoryContext()) {
        this.memoryContext()!.strokeStyle = this.penColor();
        this.memoryContext()!.lineWidth = this.lineWidth();
        this.memoryContext()!.fillStyle = this.penColor();
      }
    });

    effect(() => {
      if (this.lazyBrushInstance) {
        this.lazyBrushInstance.setRadius(this.lazyRadius());
        this.lazyBrushInstance.setFriction(this.lazyFriction());
        this.lazyEnabled() ? this.lazyBrushInstance.enable() : this.lazyBrushInstance.disable();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.resizeObserver && this.mainCanvasRef()) {
      this.resizeObserver.unobserve(this.mainCanvasRef().nativeElement);
    }
  }

  private setupPointerEvents(): void {
    const canvasEl = this.mainCanvasRef().nativeElement;

    const pointerDownEvents$ = merge(
      fromEvent<MouseEvent>(canvasEl, 'mousedown'),
      fromEvent<TouchEvent>(canvasEl, 'touchstart').pipe(
        tap(event => { if (event.cancelable) event.preventDefault(); })
      )
    ).pipe(
      filter(() => !!this.mainContext() && !!this.lazyBrushInstance),
      map(event => this.getCoordinates(event)),
      filter((coords): coords is Point => coords !== null)
    );

    const pointerMoveEvents$ = merge(
      fromEvent<MouseEvent>(this.document, 'mousemove'),
      fromEvent<TouchEvent>(this.document, 'touchmove').pipe(
        tap(event => { if (event.cancelable) event.preventDefault(); })
      )
    ).pipe(
      map(event => this.getCoordinates(event)),
      filter((coords): coords is Point => coords !== null)
    );

    const pointerUpEvents$ = merge(
      fromEvent<MouseEvent>(this.document, 'mouseup'),
      fromEvent<TouchEvent>(this.document, 'touchend'),
      fromEvent<TouchEvent>(this.document, 'touchcancel')
    );

    const drawingStream$ = pointerDownEvents$.pipe(
      tap(coords => this.handlePointerDownLogic(coords)),
      switchMap(() =>
        pointerMoveEvents$.pipe(
          takeUntil(pointerUpEvents$.pipe(
            tap(event => this.handlePointerUpLogic(event))
          ))
        )
      )
    );

    this.subscriptions.push(
      drawingStream$.subscribe(coords => {
        this.handlePointerMoveLogic(coords);
      })
    );
  }


  private setupResizeObserver(): void {
    const canvasEl = this.mainCanvasRef().nativeElement;
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
        const newWidth = contentBoxSize ? contentBoxSize.inlineSize : entry.contentRect.width;
        const newHeight = contentBoxSize ? contentBoxSize.blockSize : entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0 && (this.canvasWidth() !== newWidth || this.canvasHeight() !== newHeight)) {
          this.canvasWidth.set(newWidth);
          this.canvasHeight.set(newHeight);
        }
      }
    });
    this.resizeObserver.observe(canvasEl);
  }

  private initializeLazyBrush(): void {
    const options: LazyBrushOptions = {
      radius: this.lazyRadius(),
      enabled: this.lazyEnabled(),
      initialPoint: { x: 0, y: 0 },
      friction: this.lazyFriction()
    };
    this.lazyBrushInstance = new LazyBrush(options);
  }

  private initializeCanvasesAndContexts(): void {
    const mainCanvasEl = this.mainCanvasRef().nativeElement;
    const mainCtx = mainCanvasEl.getContext('2d');
    if (!mainCtx) { console.error('Failed to get 2D context for main canvas'); return; }
    this.mainContext.set(mainCtx);
    this.memoryCanvasElement = document.createElement('canvas');
    const memCtx = this.memoryCanvasElement.getContext('2d');
    if (!memCtx) { console.error('Failed to get 2D context for memory canvas'); return; }
    this.memoryContext.set(memCtx);
  }

  private configureContextStyling(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.penColor();
    ctx.lineWidth = this.lineWidth();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = this.penColor();
  }

  private handlePointerDownLogic(coords: Point): void {
    this.isDrawing.set(true);
    this.lazyBrushInstance.update(coords, { both: true });
    this.currentStrokePoints.set([this.lazyBrushInstance.getBrushCoordinates()]);
  }

  private handlePointerMoveLogic(coords: Point): void {
    const mainCtx = this.mainContext();
    const memCanvas = this.memoryCanvasElement;
    if (!mainCtx || !memCanvas || !this.lazyBrushInstance) return;

    this.lazyBrushInstance.update(coords);
    if (this.lazyBrushInstance.brushHasMoved()) {
      this.currentStrokePoints.update(points => [...points, this.lazyBrushInstance.getBrushCoordinates()]);
      mainCtx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
      mainCtx.drawImage(memCanvas, 0, 0);
      this.drawSmoothStroke(mainCtx, this.currentStrokePoints());
    }
  }

  private handlePointerUpLogic(event?: MouseEvent | TouchEvent): void {
    if (!this.isDrawing()) return;

    const mainCtx = this.mainContext();
    const memCtx = this.memoryContext();
    const mainCanvasEl = this.mainCanvasRef().nativeElement;

    if (!mainCtx || !memCtx || !this.memoryCanvasElement || !this.lazyBrushInstance) {
      this.isDrawing.set(false);
      this.currentStrokePoints.set([]);
      return;
    }

    const coords = event ? this.getCoordinates(event) : this.lazyBrushInstance.getPointerCoordinates();

    if (coords) {
      this.lazyBrushInstance.update(coords);
      if (this.lazyBrushInstance.brushHasMoved()) {
        this.currentStrokePoints.update(points => [...points, this.lazyBrushInstance.getBrushCoordinates()]);
      }
    }

    if (this.currentStrokePoints().length > 0) {
      mainCtx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
      mainCtx.drawImage(this.memoryCanvasElement, 0, 0);
      this.drawSmoothStroke(mainCtx, this.currentStrokePoints());
    }

    memCtx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
    memCtx.drawImage(mainCanvasEl, 0, 0);
    this.isDrawing.set(false);
    this.currentStrokePoints.set([]);
    this.save();
  }

  private drawSmoothStroke(ctx: CanvasRenderingContext2D, points: Point[]): void {
    if (points.length === 0) return;
    ctx.strokeStyle = this.penColor();
    ctx.lineWidth = this.lineWidth();
    ctx.fillStyle = this.penColor();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (points.length < 3) {
      const p1 = points[0];
      ctx.beginPath();
      if (points.length === 1) {
        const radius = this.lineWidth() / 2;
        ctx.arc(p1.x, p1.y, Math.max(0.5, radius), 0, Math.PI * 2, true);
        ctx.fill();
      } else {
        const p2 = points[1];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.closePath();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let i;
    for (i = 1; i < points.length - 2; i++) {
      const c = (points[i].x + points[i + 1].x) / 2;
      const d = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    ctx.stroke();
    ctx.closePath();
  }

  private getCoordinates(event: MouseEvent | TouchEvent | Event): Point | null {
    const canvas = this.mainCanvasRef()?.nativeElement;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent) {
      const touch = event.touches.length > 0 ? event.touches[0] :
        (event.changedTouches.length > 0 ? event.changedTouches[0] : null);
      if (touch) {
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else { return null; }
    } else {
      return null;
    }
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  clear(): void {
    const mainCtx = this.mainContext();
    const memCtx = this.memoryContext();
    if (mainCtx) {
      mainCtx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
      mainCtx.fillStyle = this.backgroundColor();
      mainCtx.fillRect(0, 0, this.canvasWidth(), this.canvasHeight());
    }
    if (memCtx) {
      memCtx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
    }
    this.currentStrokePoints.set([]);
    if (this.lazyBrushInstance) {
      const currentPointer = this.lazyBrushInstance.getPointerCoordinates();
      this.lazyBrushInstance.update(currentPointer, {both: true});
    }
    this.signatureCleared.emit();
  }

  save(): void {
    const memCanvas = this.memoryCanvasElement;
    if (!memCanvas) {
      console.warn('Memory canvas not available for saving.'); return;
    }
    if (this.isCanvasEffectivelyBlank(memCanvas)) {
      console.warn('Canvas is effectively empty or contains only background. Nothing to save.'); return;
    }
    const dataUrl = memCanvas.toDataURL('image/png');
    this.signatureSaved.emit(dataUrl);
  }

  onColorChange(color: string) {
    this.penColor.set(color);
  }

  private isCanvasEffectivelyBlank(canvas: HTMLCanvasElement): boolean {
    if (!canvas) return true;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return true;
    tempCtx.fillStyle = this.backgroundColor();
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    return canvas.toDataURL() === tempCanvas.toDataURL();
  }

  handleEscapeKey(event: KeyboardEvent): void {
    this.clear();
  }
}
