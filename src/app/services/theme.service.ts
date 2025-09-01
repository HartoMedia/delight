import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private settingsService: SettingsService) {
    this.initializeTheme();
    this.settingsService.settings$.subscribe(settings => {
      this.applyTheme(settings.theme);
    });
  }

  initializeTheme(): void {
    const settings = this.settingsService.getSettings();
    this.applyTheme(settings.theme);
  }

  private applyTheme(theme: 'default' | 'dev'): void {
    const body = document.body;

    // Entferne alle Theme-Klassen
    body.classList.remove('theme-default', 'theme-dev');

    // Füge die entsprechende Theme-Klasse hinzu
    body.classList.add(`theme-${theme}`);

    // Setze CSS Custom Properties für Ionic
    if (theme === 'dev') {
      this.setDevModeColors();
    } else {
      this.setDefaultColors();
    }
  }

  private setDevModeColors(): void {
    const root = document.documentElement;

    // Gelbes Entwickler-Farbschema
    root.style.setProperty('--ion-color-primary', '#ffd700');
    root.style.setProperty('--ion-color-primary-rgb', '255, 215, 0');
    root.style.setProperty('--ion-color-primary-contrast', '#000000');
    root.style.setProperty('--ion-color-primary-contrast-rgb', '0, 0, 0');
    root.style.setProperty('--ion-color-primary-shade', '#e0be00');
    root.style.setProperty('--ion-color-primary-tint', '#ffdc1a');

    // Sekundäre Farbe (Orange-Gelb)
    root.style.setProperty('--ion-color-secondary', '#ffb347');
    root.style.setProperty('--ion-color-secondary-rgb', '255, 179, 71');
    root.style.setProperty('--ion-color-secondary-contrast', '#000000');
    root.style.setProperty('--ion-color-secondary-contrast-rgb', '0, 0, 0');
    root.style.setProperty('--ion-color-secondary-shade', '#e09e3e');
    root.style.setProperty('--ion-color-secondary-tint', '#ffbb59');

    // Akzentfarbe (Bernstein)
    root.style.setProperty('--ion-color-tertiary', '#ffbf00');
    root.style.setProperty('--ion-color-tertiary-rgb', '255, 191, 0');
    root.style.setProperty('--ion-color-tertiary-contrast', '#000000');
    root.style.setProperty('--ion-color-tertiary-contrast-rgb', '0, 0, 0');
    root.style.setProperty('--ion-color-tertiary-shade', '#e0a800');
    root.style.setProperty('--ion-color-tertiary-tint', '#ffc61a');

    // Warnfarbe (Orange)
    root.style.setProperty('--ion-color-warning', '#ff8c00');
    root.style.setProperty('--ion-color-warning-rgb', '255, 140, 0');
    root.style.setProperty('--ion-color-warning-contrast', '#ffffff');
    root.style.setProperty('--ion-color-warning-contrast-rgb', '255, 255, 255');
    root.style.setProperty('--ion-color-warning-shade', '#e07b00');
    root.style.setProperty('--ion-color-warning-tint', '#ff981a');

    // Hintergrundfarben
    root.style.setProperty('--ion-background-color', '#fffef7');
    root.style.setProperty('--ion-background-color-rgb', '255, 254, 247');

    // Toolbar/Header Hintergrund
    root.style.setProperty('--ion-toolbar-background', '#ffd700');
    root.style.setProperty('--ion-toolbar-color', '#000000');

    // Tab Bar
    root.style.setProperty('--ion-tab-bar-background', '#fff8dc');
    root.style.setProperty('--ion-tab-bar-color-selected', '#ffd700');

    // Dev Mode Indikator
    root.style.setProperty('--dev-mode-indicator', 'block');
  }

  private setDefaultColors(): void {
    const root = document.documentElement;

    // Entferne alle benutzerdefinierten Eigenschaften
    const propertiesToRemove = [
      '--ion-color-primary',
      '--ion-color-primary-rgb',
      '--ion-color-primary-contrast',
      '--ion-color-primary-contrast-rgb',
      '--ion-color-primary-shade',
      '--ion-color-primary-tint',
      '--ion-color-secondary',
      '--ion-color-secondary-rgb',
      '--ion-color-secondary-contrast',
      '--ion-color-secondary-contrast-rgb',
      '--ion-color-secondary-shade',
      '--ion-color-secondary-tint',
      '--ion-color-tertiary',
      '--ion-color-tertiary-rgb',
      '--ion-color-tertiary-contrast',
      '--ion-color-tertiary-contrast-rgb',
      '--ion-color-tertiary-shade',
      '--ion-color-tertiary-tint',
      '--ion-color-warning',
      '--ion-color-warning-rgb',
      '--ion-color-warning-contrast',
      '--ion-color-warning-contrast-rgb',
      '--ion-color-warning-shade',
      '--ion-color-warning-tint',
      '--ion-background-color',
      '--ion-background-color-rgb',
      '--ion-toolbar-background',
      '--ion-toolbar-color',
      '--ion-tab-bar-background',
      '--ion-tab-bar-color-selected'
    ];

    propertiesToRemove.forEach(property => {
      root.style.removeProperty(property);
    });

    // Dev Mode Indikator ausblenden
    root.style.setProperty('--dev-mode-indicator', 'none');
  }

  // Diese Methoden werden für Kompatibilität mit bestehender Settings-Seite benötigt
  isDarkMode(): boolean {
    return document.body.classList.contains('dark');
  }

  toggleTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
