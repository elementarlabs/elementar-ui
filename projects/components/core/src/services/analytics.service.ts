import { inject, Injectable, isDevMode, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { EnvironmentService } from './environment.service';

declare const gtag: any;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  private _document = inject(DOCUMENT);
  private _environmentService = inject(EnvironmentService);

  trackPageViews(): void {
    const googleAnalyticsId = this._environmentService.getValue('googleAnalyticsId');

    if (isDevMode() || !googleAnalyticsId) {
      return;
    }

    try {
      const url = 'https://www.googletagmanager.com/gtag/js?id=';
      const gTagScript = this._document.createElement('script');
      gTagScript.async = true;
      gTagScript.src = `${url}${googleAnalyticsId}`;
      this._document.head.appendChild(gTagScript);
      const dataLayerScript = this._document.createElement('script');
      dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}');`
      ;
      this._document.head.appendChild(dataLayerScript);

      if (isPlatformServer(this._platformId)) {
        return;
      }

      this._router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
      ).subscribe((event: any) => {
        gtag('event', 'page_view', {
            page_title: this._document.head.title,
            page_path: event.urlAfterRedirects,
            page_location: this._document.location.href
          });
        })
      ;
    } catch (e) {
    }
  }
}
