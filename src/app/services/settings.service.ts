import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
  devMode: boolean;
  theme: 'default' | 'dev';
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<AppSettings>({
    devMode: false,
    theme: 'default'
  });

  public settings$ = this.settingsSubject.asObservable();

  private storageKey = 'app-settings';

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem(this.storageKey);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.settingsSubject.next({
          devMode: settings.devMode || false,
          theme: settings.devMode ? 'dev' : 'default'
        });
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error);
    }
  }

  private saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      this.settingsSubject.next(settings);
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error);
    }
  }

  toggleDevMode(): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings: AppSettings = {
      devMode: !currentSettings.devMode,
      theme: !currentSettings.devMode ? 'dev' : 'default'
    };
    this.saveSettings(newSettings);
  }

  getSettings(): AppSettings {
    return this.settingsSubject.value;
  }

  isDevMode(): boolean {
    return this.settingsSubject.value.devMode;
  }
}
