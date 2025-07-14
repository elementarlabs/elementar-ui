import { afterNextRender, inject, Injectable, DOCUMENT } from '@angular/core';


const LOCAL_STORAGE_KEY = 'emr-admin';

@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {
  private _document = inject(DOCUMENT);
  private _window = this._document.defaultView;
  private _colorScheme: 'dark' | 'light';

  constructor() {
    afterNextRender(() => {
      if (this._window !== null && this._window.matchMedia) {
        this._window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', () => {
            const storedColorScheme = this._getStoredColorScheme();

            if (storedColorScheme !== 'light' && storedColorScheme !== 'dark') {
              this.setColorScheme(this.getPreferredColorScheme());
            }
          })
        ;
      }
    });
  }

  getColorScheme(): 'dark' | 'light' {
    return this._colorScheme;
  }

  toggleColorScheme(): void {
    if (this._getStoredColorScheme() === 'dark') {
      this.changeColorScheme('light');
    } else {
      this.changeColorScheme('dark');
    }
  }

  changeColorScheme(colorScheme: 'dark' | 'light'): void {
    this._colorScheme = colorScheme;
    this._setStoredColorScheme(colorScheme);
    this.setColorScheme(colorScheme);
  }

  private _getStoredColorScheme() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}').colorScheme;
  };

  private _setStoredColorScheme(colorScheme: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const meta = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}');
    meta.colorScheme = colorScheme;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meta));
  };

  getPreferredColorScheme(): 'dark' | 'light' {
    const storedTheme = this._getStoredColorScheme();

    if (storedTheme) {
      return storedTheme;
    }

    if (this._window !== null && this._window.matchMedia) {
      return this._window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  };

  setColorScheme(colorScheme: string): void {
    if (this._window !== null && this._window.matchMedia) {
      if (
        colorScheme === 'auto' &&
        this._window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        this._colorScheme = 'dark';
        this._document.documentElement.classList.add('dark');
      } else {
        if (colorScheme === 'dark') {
          this._colorScheme = 'dark';
          this._document.documentElement.classList.add('dark');
        } else {
          this._colorScheme = 'light';
          this._document.documentElement.classList.remove('dark');
        }
      }
    }
  };
}
