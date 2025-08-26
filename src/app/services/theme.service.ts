import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_MODE_KEY = 'darkMode';

  constructor() {
    this.initializeTheme();
  }

  initializeTheme(): void {
    // Check if user has a saved preference
    const savedDarkMode = localStorage.getItem(this.DARK_MODE_KEY);

    if (savedDarkMode !== null) {
      // Use saved preference
      const isDark = savedDarkMode === 'true';
      this.applyTheme(isDark);
    } else {
      // Use system preference as fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.applyTheme(prefersDark.matches);

      // Listen for system changes if no user preference is saved
      prefersDark.addEventListener('change', (mediaQuery) => {
        // Only apply system changes if user hasn't set a preference
        if (localStorage.getItem(this.DARK_MODE_KEY) === null) {
          this.applyTheme(mediaQuery.matches);
        }
      });
    }
  }

  toggleTheme(isDark: boolean): void {
    // Save user preference
    localStorage.setItem(this.DARK_MODE_KEY, isDark.toString());

    // Apply the theme
    this.applyTheme(isDark);
  }

  isDarkMode(): boolean {
    const savedDarkMode = localStorage.getItem(this.DARK_MODE_KEY);

    if (savedDarkMode !== null) {
      return savedDarkMode === 'true';
    }

    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }
}
