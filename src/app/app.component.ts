import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
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
export class AppComponent {
  public appPages = [
    {title: 'Home', url: '/home', icon: 'home'},
    {title: 'About', url: '/about', icon: 'information-circle'},
    {title: 'Settings', url: '/settings', icon: 'settings'},

  ];

  constructor() {
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
}
