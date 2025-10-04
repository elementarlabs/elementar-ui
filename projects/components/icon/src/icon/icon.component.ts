import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  OnInit, signal,
  SimpleChanges
} from '@angular/core';
import { loadIcon, enableCache } from 'iconify-icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { v7 as uuid } from 'uuid';
enableCache('all');

@Component({
  selector: 'emr-icon',
  exportAs: 'emrIcon',
  standalone: true,
  template: '',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-icon',
    '[innerHTML]': '_iconHtml()',
  }
})
export class IconComponent implements OnInit, OnChanges {
  private _sanitizer = inject(DomSanitizer);
  protected _iconHtml = signal<SafeHtml | null>(null);

  name = input.required<string>();

  private loaded = false;

  async ngOnInit() {
    await this._loadIcon();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['name'] && !changes['name'].isFirstChange()) {
      if (changes['name'].previousValue === changes['name'].currentValue) {
        return;
      }

      this.loaded = false;
      await this._loadIcon();
    }
  }

  private async _loadIcon() {
    if (this.loaded) {
      return;
    }

    if (!this.name()) {
      this.loaded = true;
      return;
    }

    const data = await loadIcon(this.name());
    let body = data.body;

    // If svg icon has mask of defs with id, we need to replace to unique id
    // because the same icons can be used on the same page and use the same id, which can cause problems.
    const allIdMatches = [...body.matchAll(/id="(\w+)"/g)];

    if (allIdMatches.length > 0) {
      allIdMatches.forEach(match => {
        body = body.replaceAll(match[1], uuid());
      });
    }

    const iconHtml = `<svg viewBox="0 0 ${data.width} ${data.height}">${body}</svg>`;
    this._iconHtml.set(this._sanitizer.bypassSecurityTrustHtml(iconHtml));
    this.loaded = true;
  }
}
