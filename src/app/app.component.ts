import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle, IonNote,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  homeOutline,
  homeSharp,
  informationCircle,
  informationCircleOutline,
  informationCircleSharp,
  settingsOutline,
  settingsSharp
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, IonNote],
})
export class AppComponent implements OnInit {
  public appPages = [
    {title: 'Home', url: '/home', icon: 'home'},
    {title: 'About', url: '/about', icon: 'information-circle'},
    {title: 'Settings', url: '/settings', icon: 'settings'},

  ];

  public versionInfo = {
    version: '',
    releaseDate: '',
    versionName: ''
  };

  constructor(private http: HttpClient) {
    addIcons({
      homeSharp,
      homeOutline,
      informationCircleSharp,
      informationCircleOutline,
      informationCircle,
      settingsSharp,
      settingsOutline
    });
  }

  ngOnInit() {
    this.loadVersionInfo();
  }

  private loadVersionInfo() {
    this.http.get<any>('/manifest.webmanifest').subscribe({
      next: (manifest) => {
        this.versionInfo = {
          version: manifest.version || 'N/A',
          releaseDate: manifest.releasedate ? new Date(manifest.releasedate).toLocaleDateString() : 'N/A',
          versionName: manifest.version_name || 'N/A'
        };
      },
      error: (error) => {
        console.error('Error loading manifest:', error);
      }
    });
  }
}
