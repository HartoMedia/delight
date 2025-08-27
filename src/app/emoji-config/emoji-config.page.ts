import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save, refresh, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-emoji-config',
  templateUrl: './emoji-config.page.html',
  styleUrls: ['./emoji-config.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class EmojiConfigPage implements OnInit {
  emojis: string[] = ['😀', '😊', '🎉', '❤️', '🌟', '🚀', '🎨', '🌈'];
  selectedIndex: number = -1;

  emojiOptions: string[] = [
    '😀', '😊', '😂', '🥰', '😍', '🤩', '🥳', '😎',
    '🤔', '😴', '🤯', '🥺', '😭', '😡', '🤬', '😱',
    '🎉', '🎊', '🎈', '🎁', '🎂', '🍰', '🧁', '🍭',
    '❤️', '💙', '💚', '💛', '💜', '🧡', '🖤', '🤍',
    '🌟', '⭐', '✨', '💫', '☄️', '🌙', '☀️', '🌈',
    '🚀', '✈️', '🚗', '🚲', '⛵', '🏰', '🗽', '🎡',
    '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🃏',
    '🐶', '🐱', '🐸', '🦄', '🐧', '🐻', '🐼', '🦊',
    '🌺', '🌻', '🌷', '🌹', '🌸', '🌼', '🌿', '🍀',
    '⚽', '🏀', '🎾', '🏈', '🏐', '🏓', '🎳', '⛳'
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ save, refresh, arrowBack });
  }

  ngOnInit() {
    this.loadConfiguration();
  }

  loadConfiguration() {
    const savedEmojis = localStorage.getItem('emoji-configuration');
    if (savedEmojis) {
      this.emojis = JSON.parse(savedEmojis);
    }
  }

  selectEmoji(index: number) {
    this.selectedIndex = index;
  }

  changeEmoji(emoji: string) {
    if (this.selectedIndex !== -1) {
      this.emojis[this.selectedIndex] = emoji;
      this.selectedIndex = -1;
    }
  }

  async saveConfiguration() {
    localStorage.setItem('emoji-configuration', JSON.stringify(this.emojis));

    const toast = await this.toastController.create({
      message: 'Emoji-Konfiguration gespeichert!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  async resetToDefault() {
    this.emojis = ['😀', '😊', '🎉', '❤️', '🌟', '🚀', '🎨', '🌈'];
    localStorage.removeItem('emoji-configuration');

    const toast = await this.toastController.create({
      message: 'Auf Standard zurückgesetzt!',
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }
}
