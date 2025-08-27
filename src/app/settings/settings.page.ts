import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Platform} from '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonList,
  IonListHeader,
  IonItem,
  IonToggle,
  IonLabel,
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {chevronForward, trash} from 'ionicons/icons';
import {ThemeService} from '../services/theme.service';
import {DelightService} from '../services/delight-service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonList,
    IonListHeader,
    IonItem,
    IonToggle,
    IonLabel,
    IonIcon
  ]
})
export class SettingsPage implements OnInit {
  paletteToggle = false;
  isAndroid = false;

  constructor(
    private themeService: ThemeService,
    private platform: Platform,
    private router: Router,
    private delightService: DelightService,
    private alertController: AlertController
  ) {
    addIcons({chevronForward, trash});
  }

  ngOnInit() {
    // Get current theme state from service
    this.paletteToggle = this.themeService.isDarkMode();

    // Check if platform is Android
    this.isAndroid = this.platform.is('android');
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    const isDark = event.detail.checked;
    this.themeService.toggleTheme(isDark);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToEmojiConfig() {
    this.router.navigate(['/emoji-config']);
  }

  async clearAllData() {
    const alert = await this.alertController.create({
      header: 'Alle Daten löschen',
      message: 'Möchten Sie wirklich alle Delights und Daten aus dem Local Storage löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          role: 'destructive',
          handler: () => {
            this.performDataClear();
          }
        }
      ]
    });

    await alert.present();
  }

  private performDataClear() {
    try {
      // Lösche alle Delights über den Service
      this.delightService.deleteAllDelights();

      // Lösche zusätzlich alle anderen App-Daten aus dem Local Storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      this.presentSuccessAlert();
    } catch (error) {
      console.error('Fehler beim Löschen der Daten:', error);
      this.presentErrorAlert();
    }
  }

  private async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Erfolgreich',
      message: 'Alle Daten wurden erfolgreich gelöscht.',
      buttons: ['OK']
    });

    await alert.present();
  }

  private async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Fehler',
      message: 'Beim Löschen der Daten ist ein Fehler aufgetreten.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
