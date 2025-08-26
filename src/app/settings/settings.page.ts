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
  IonIcon
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {chevronForward} from 'ionicons/icons';
import {ThemeService} from '../services/theme.service';

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

  constructor(private themeService: ThemeService, private platform: Platform, private router: Router) {
    addIcons({chevronForward});
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
}
