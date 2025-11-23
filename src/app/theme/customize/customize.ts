import { Component, signal } from '@angular/core';
import { CodeHighlighter } from '@elementar-ui/components/code-highlighter';

@Component({
  selector: 'app-customize',
  imports: [
    CodeHighlighter
  ],
  templateUrl: './customize.html',
  styleUrl: './customize.scss'
})
export class Customize {
  defaultTheme = signal(`@use '@elementar-ui/components/styles/themes/default';`);
  roseRedTheme = signal(`@use '@elementar-ui/components/styles/themes/magenta-violet';`);
  generateAngularTheme = signal(`ng generate @angular/material:theme-color my-theme`);
  addTheme = signal(`@use './my-theme' as themeColors;
@use '@angular/material' as mat;
@use "@elementar-ui/components/styles/common" with (
  $m3-light-theme: mat.define-theme((
    color: (
      theme-type: light,
      primary: themeColors.$primary-palette,
      tertiary: themeColors.$tertiary-palette,
      use-system-variables: true,
      system-variables-prefix: sys,
    ),
    typography: (
      brand-family: 'var(--font-sans)',
      plain-family: 'var(--font-sans)',
      use-system-variables: true,
      system-variables-prefix: sys,
    ),
    density: (
      scale: 0,
    ),
  )),
  $m3-dark-theme: mat.define-theme((
    color: (
      theme-type: dark,
      primary: themeColors.$primary-palette,
      tertiary: themeColors.$tertiary-palette,
      use-system-variables: true,
      system-variables-prefix: sys,
    ),
    typography: (
      brand-family: 'var(--font-sans)',
      plain-family: 'var(--font-sans)',
      use-system-variables: true,
      system-variables-prefix: sys,
    ),
    density: (
      scale: 0,
    ),
  ))
);
@include mat.elevation-classes();
@include mat.app-background();`);
}
