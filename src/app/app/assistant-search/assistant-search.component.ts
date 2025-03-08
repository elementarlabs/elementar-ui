import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  SuggestionBlockComponent,
  SuggestionComponent,
  SuggestionIconDirective,
  SuggestionsComponent,
  SuggestionThumbDirective,
} from '@elementar-ui/components/suggestions';
import { AvatarComponent } from '@elementar-ui/components/avatar';

@Component({
  selector: 'app-assistant-search',
  imports: [
    MatIcon,
    SuggestionsComponent,
    SuggestionBlockComponent,
    SuggestionComponent,
    MatButton,
    SuggestionIconDirective,
    SuggestionThumbDirective,
    FormsModule,
    MatIconButton,
    AvatarComponent,
  ],
  templateUrl: './assistant-search.component.html',
  styleUrl: './assistant-search.component.scss',
  host: {
    class: 'assistant-search',
    '[class.has-dropdown]': '_isAttached',
  },
})
export class AssistantSearchComponent implements OnDestroy {
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  private _elementRef = inject(ElementRef);
  protected _isAttached = false;
  private _overlayRef!: OverlayRef;
  protected searchText = '';

  ngOnDestroy(): void {
    this.close();
  }

  focus(event: FocusEvent, suggestionDropdown: TemplateRef<unknown>) {
    event.preventDefault();
    if (this._isAttached) {
      return;
    }

    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._elementRef)
        .withLockedPosition()
        .withGrowAfterOpen()
        .withPositions([
          {
            originY: 'bottom',
            overlayY: 'top',
            originX: 'start',
            overlayX: 'start',
          },
        ]),
    });
    const portal = new TemplatePortal(
      suggestionDropdown,
      this._viewContainerRef
    );
    this._overlayRef.attach(portal);
    this._isAttached = true;
    this._overlayRef.outsidePointerEvents().subscribe((event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest('.assistant-search')) {
        return;
      }

      this.close();
    });
  }

  close(): void {
    this._overlayRef?.dispose();
    this._isAttached = false;
  }

  clearText() {
    this.searchText = '';
  }
}
