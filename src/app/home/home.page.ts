import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonModal,
  IonButton,
  IonItem,
  IonLabel,
  IonTextarea
} from '@ionic/angular/standalone';
import { DelightService } from '../services/delight-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonModal,
    IonButton,
    IonItem,
    IonLabel,
    IonTextarea
  ]
})
export class HomePage implements OnInit {
  emojis: string[] = ['😀', '😊', '🎉', '❤️', '🌟', '🚀', '🎨', '🌈'];
  isModalOpen = false;
  selectedEmoji = '';
  description = '';

  constructor(private delightService: DelightService) { }

  ngOnInit() {
    this.loadEmojiConfiguration();
  }

  loadEmojiConfiguration() {
    const savedEmojis = localStorage.getItem('emoji-configuration');
    if (savedEmojis) {
      this.emojis = JSON.parse(savedEmojis);
    }
  }

  onEmojiClick(emoji: string) {
    this.selectedEmoji = emoji;
    this.description = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEmoji = '';
    this.description = '';
  }

  saveDelight() {
    const delightData = {
      emoji: this.selectedEmoji,
      description: this.description || '',
      tags: [],
      imageBase64: undefined
    };

    this.delightService.createDelight(delightData);
    this.closeModal();
    console.log('Delight erfolgreich gespeichert!');
  }
}
