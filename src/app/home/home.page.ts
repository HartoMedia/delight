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
  IonTextarea,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/angular/standalone';
import { DelightService, Delight } from '../services/delight-service';

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
    IonTextarea,
    IonList,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle
  ]
})
export class HomePage implements OnInit {
  emojis: string[] = ['😀', '😊', '🎉', '❤️', '🌟', '🚀', '🎨', '🌈'];
  isModalOpen = false;
  selectedEmoji = '';
  description = '';
  existingDelights: Delight[] = [];

  constructor(private delightService: DelightService) { }

  ngOnInit() {
    this.loadEmojiConfiguration();
    this.loadExistingDelights();
  }

  loadEmojiConfiguration() {
    const savedEmojis = localStorage.getItem('emoji-configuration');
    if (savedEmojis) {
      this.emojis = JSON.parse(savedEmojis);
    }
  }

  loadExistingDelights() {
    this.delightService.getAllDelights().subscribe(delights => {
      this.existingDelights = delights.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
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
    // Lade die Delights neu, um die neue Eingabe anzuzeigen
    this.loadExistingDelights();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
