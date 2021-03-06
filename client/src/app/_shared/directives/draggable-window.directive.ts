import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject, merge, fromEvent } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { UpdateWindowPosition } from '../../../stores';
import { OptionsService } from '../../services/options.service';

@Directive({
  selector: '[appDraggableWindow]'
})
export class DraggableDirective implements OnInit, OnDestroy {
  private isDragAllowed = true;
  private handle: HTMLElement = null;
  private destroy$ = new Subject<void>();

  @Input('appDraggableWindow')
  set allowDrag(value: boolean) {
    this.isDragAllowed = value;
  }

  @Input()
  set windowHandle(handle: HTMLElement) {
    this.handle = handle;

    if (this.isDragAllowed) {
      this.handle.style.position = 'relative';
      this.handle.className += ' cursor-draggable';
    } else {
      this.handle.className = this.handle.className.replace(' cursor-draggable', '');
    }
  }

  @Input()
  public windowName: string;

  @Input()
  public set windowLocation(data) {
    if (!data) return;
    this.setNativeCoords(data);
  }

  constructor(
    private optionsService: OptionsService,
    public store: Store,
    public element: ElementRef
  ) {}

  ngOnInit(): void {
    const mouseToMoveData = (mouse: MouseEvent) => ({
        event: mouse,
        x: mouse.clientX,
        y: mouse.clientY,
        target: mouse.target,
        button: mouse.button,
      } as PositionEvent);

    const touchToMoveData = (touch: TouchEvent) => ({
        event: touch,
        x: touch.changedTouches[0].clientX,
        y: touch.changedTouches[0].clientY,
        target: touch.target,
        button: 1
      } as PositionEvent);

    const nativeElement = this.element.nativeElement;

    const mousedown$ = fromEvent<MouseEvent>(nativeElement, 'mousedown').pipe(map(mouseToMoveData));
    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(map(mouseToMoveData));
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(map(mouseToMoveData));
    const mouseleave$ = fromEvent<MouseEvent>(document.body, 'mouseleave').pipe(map(mouseToMoveData));

    const touchstart$ = fromEvent<TouchEvent>(nativeElement, 'touchstart').pipe(map(touchToMoveData));
    const touchmove$ = fromEvent<TouchEvent>(document, 'touchmove').pipe(map(touchToMoveData));
    const touchend$ = fromEvent<TouchEvent>(nativeElement, 'touchend').pipe(map(touchToMoveData));

    const startmove$ = merge(mousedown$, touchstart$);
    const movemove$ = merge(mousemove$, touchmove$);
    const endmove$ = merge(mouseup$, touchend$, mouseleave$);

    startmove$.pipe(takeUntil(this.destroy$)).subscribe(startMove => {
      if (this.optionsService.lockWindows) return;
      if (!this.isDragAllowed) return;
      if (startMove.button === 2 || (this.handle !== undefined && startMove.target !== this.handle)) return;
      startMove.event.preventDefault();
      startMove.event.stopPropagation();

      const windowCoords = this.getNativeCoords();
      const startCoord = this.diff(windowCoords, startMove);
      endmove$.pipe(takeUntil(this.destroy$)).subscribe(endmove => {
          endmove.event.preventDefault();
          endmove.event.stopPropagation();
      });
      const pospipe$ = movemove$.pipe(takeUntil(endmove$), takeUntil(this.destroy$),
        map((moveMove) => {
          moveMove.event.preventDefault();
          moveMove.event.stopPropagation();
          return this.clampWindow(this.diff(startCoord, moveMove));
        })
      );

      pospipe$.subscribe(position => {
        this.setNativeCoords(position);
      });

      pospipe$.pipe(debounceTime(500)).subscribe(position => {
        this.store.dispatch(new UpdateWindowPosition(this.windowName, position, true));
      });
    });
  }

  private clampWindow(pos: Position) {
    const native = this.element.nativeElement as any;
    const maxWidth = window.innerWidth - native.offsetWidth;
    const maxHeight = window.innerHeight - native.offsetHeight;
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
    if (pos.x > maxWidth) pos.x = maxWidth;
    if (pos.y > maxHeight) pos.y = maxHeight;
    return pos;
  }

  private diff(end: Position, start: Position) {
    return { x: start.x - end.x, y: start.y - end.y };
  }

  private setNativeCoords(pos: Position): void {
    this.element.nativeElement.style.left = `${pos.x}px`;
    this.element.nativeElement.style.top = `${pos.y}px`;
  }

  private getNativeCoords(): Position {
    return {
      x: this.element.nativeElement.style.left.replace('px', ''),
      y: this.element.nativeElement.style.top.replace('px', ''),
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface Position {
  x: number;
  y: number;
}

interface PositionEvent extends Position {
  event: any;
  target: EventTarget;
  button: number;
}
