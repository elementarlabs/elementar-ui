import {
  ChangeDetectionStrategy,
  Component, computed,
  contentChild,
  inject,
  OnInit, output,
  ViewContainerRef
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { ColorSchemeStore } from '../color-scheme.store';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { ColorSchemeLightDirective } from '../color-scheme-light.directive';
import { ColorSchemeDarkDirective } from '../color-scheme-dark.directive';
import { ColorScheme } from '../color-scheme.model';

@Component({
  selector: 'emr-color-scheme-switcher',
  exportAs: 'emrColorSchemeSwitcher',
  imports: [
    MatIconButton,
    CdkPortalOutlet,
  ],
  templateUrl: './color-scheme-switcher.component.html',
  styleUrl: './color-scheme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-color-scheme-switcher',
    ngSkipHydration: 'true' // important! to prevent double render for icons
  }
})
export class ColorSchemeSwitcherComponent implements OnInit {
  private store = inject(ColorSchemeStore);
  private viewContainerRef = inject(ViewContainerRef);

  private lightRef = contentChild.required(ColorSchemeLightDirective);
  private darkRef = contentChild.required(ColorSchemeDarkDirective);

  readonly colorScheme = computed(() => this.store.theme());
  readonly colorSchemeChanged = output<ColorScheme>();

  protected portal!: TemplatePortal<any>;

  ngOnInit() {
    this.setPortal();
  }

  protected toggleScheme() {
    const newScheme = this.store.theme() === 'dark' ? 'light' : 'dark';
    this.store.setScheme(newScheme);
    this.setPortal();
    this.colorSchemeChanged.emit(this.store.theme());
  }

  private setPortal() {
    if (this.colorScheme() === 'light') {
      this.portal = new TemplatePortal(this.lightRef().templateRef, this.viewContainerRef);
    } else if (this.colorScheme() === 'dark') {
      this.portal = new TemplatePortal(this.darkRef().templateRef, this.viewContainerRef);
    }
  }
}
