import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then( m => m.AboutComponent)
  },
  {
    path: 'emoji-config',
    loadComponent: () => import('./emoji-config/emoji-config.page').then( m => m.EmojiConfigPage)
  },
];
