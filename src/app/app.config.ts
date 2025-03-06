import {
  ApplicationConfig,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PageTitleStrategyService } from '@elementar-ui/components/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideStore(),
    provideNativeDateAdapter(),
    provideAppInitializer(() => {
      // Initialize from backend
      // const http = inject(HttpClient);
      // return firstValueFrom(
      //   http.get('https://example.com/api/initialize')
      //     .pipe(
      //       tap((response: any) => console.log('Initializing App'))
      //     )
      // );
      return new Promise((resolve, reject) => {
        try {
          return resolve(true);
        } catch (e) {
          return reject(e);
        }
      });
    }),
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategyService,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
};
