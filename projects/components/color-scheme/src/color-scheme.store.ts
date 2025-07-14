import { effect, inject, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { COLOR_SCHEME_LOCAL_KEY, ColorScheme } from './color-scheme.model';

type ColorSchemeState = {
  theme: ColorScheme;
};

const initialState: ColorSchemeState = {
  theme: 'light',
};

export const ColorSchemeStore = signalStore(
  withState(initialState),
  withMethods((store) => {
    const platformId = inject(PLATFORM_ID);
    return {
      setScheme(scheme: ColorScheme): void {
        patchState(store, { theme: scheme });
        if (isPlatformBrowser(platformId)) {
          localStorage.setItem(COLOR_SCHEME_LOCAL_KEY, scheme);
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      const document = inject(DOCUMENT);

      effect(() => {
        const scheme = store.theme();

        if (scheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (scheme === 'light') {
          document.documentElement.classList.remove('dark');
        }
      });
    },
  }),
);
