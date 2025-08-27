import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton]
})
export class HomePage implements OnInit {
  emojis: string[] = ['😀', '😊', '🎉', '❤️', '🌟', '🚀', '🎨', '🌈'];

  constructor() { }

  ngOnInit() {
    this.loadEmojiConfiguration();
  }

  loadEmojiConfiguration() {
    const savedEmojis = localStorage.getItem('emoji-configuration');
    if (savedEmojis) {
      this.emojis = JSON.parse(savedEmojis);
    }
  }
}
