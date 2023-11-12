import { Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  setTheme(theme: string) {
    this.applyTheme(theme);
    localStorage.setItem('themeColor', theme);
  }

  private applyTheme(theme: string) {
    const BODY = document.getElementsByTagName('body')[0];
    BODY.classList.remove('primary-theme', 'accent-theme', 'warn-theme');
    BODY.classList.add(`${theme}-theme`);
  }

  getTheme(): ThemePalette {
    if (
      localStorage.getItem('themeColor') === null ||
      localStorage.getItem('themeColor') === undefined
    ) {
      return 'primary';
    } else {
      const STORED_THEME_COLOR = localStorage.getItem('themeColor');
      return STORED_THEME_COLOR as ThemePalette;
    }
  }
}
