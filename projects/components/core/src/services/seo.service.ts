import { DestroyRef, inject, Injectable, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalStore } from '../global.state';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _document = inject(DOCUMENT);
  private readonly _platformId = inject(PLATFORM_ID);
  private _linkCanonical: HTMLLinkElement | null;
  private _title = inject(Title);
  private _meta = inject(Meta);
  private _globalStore = inject(GlobalStore);

  get meta(): Meta {
    return this._meta;
  }

  updateDescription(content?: string): void {
    if (!content) {
      return;
    }

    this.meta.updateTag({
      name: 'description',
      content
    });
    this.meta.updateTag({
      name: 'og:description',
      content
    });
  }

  updateOgUrl(content?: string): void {
    if (!content) {
      return;
    }

    this.meta.updateTag({
      name: 'og:url',
      content
    });
  }

  updateOgImage(content: string): void {
    if (!content) {
      return;
    }

    this.meta.updateTag({
      name: 'og:image',
      content
    });
  }

  trackCanonicalChanges(siteUrl: string): void {
    this._createCanonicalTag(siteUrl);

    if (isPlatformServer(this._platformId)) {
      return;
    }

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        const href = this.getCanonicalUrl(siteUrl);
        this._linkCanonical?.setAttribute('href', href);
        this.updateOgUrl(href);
      })
    ;
  }

  updateTitle(title: string): void {
    this._title.setTitle(`${title} | ${this._globalStore.pageTitle()}`);
    this.meta.updateTag({
      name: 'og:title',
      content: title
    });
  }

  private getCanonicalUrl(siteUrl: string): string {
    if (this._document.URL.startsWith('http')) {
      return this._document.URL;
    }

    return siteUrl + this._document.URL;
  }

  private _createCanonicalTag(siteUrl: string): void {
    this._linkCanonical = this._document.querySelector('link[rel="canonical"]');

    if (!this._linkCanonical) {
      this._linkCanonical = this._document.createElement('link');
      this._linkCanonical.setAttribute('rel', 'canonical');
      this._document.head.appendChild(this._linkCanonical);
    }

    this._linkCanonical.setAttribute('href', this.getCanonicalUrl(siteUrl));
  }
}
