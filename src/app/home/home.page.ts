import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Delight, DelightService} from '../services/delight-service';

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
    IonCardHeader
  ]
})
export class HomePage implements OnInit {
  emojis: string[] = ['😀', '😊', '🎉', '❤️', '🌟', '🚀', '🎨', '🌈'];
  isModalOpen = false;
  selectedEmoji = '';
  description = '';
  existingDelights: Delight[] = [];
  capturedImage: string | undefined = undefined;

  constructor(private delightService: DelightService) {
  }

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
    this.capturedImage = undefined;
  }

  saveDelight() {
    const delightData = {
      emoji: this.selectedEmoji,
      description: this.description || '',
      tags: [],
      imageBase64: this.capturedImage
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

  // Neue Methoden für Foto-Funktionalität
  async capturePhoto() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Rückkamera bevorzugen
        }
      });

      // Erstelle ein Video-Element für die Kamera-Vorschau
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Warte bis das Video geladen ist
      video.addEventListener('loadedmetadata', () => {
        // Erstelle ein Canvas-Element zum Aufnehmen des Fotos
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Zeichne das aktuelle Video-Frame auf das Canvas
        context?.drawImage(video, 0, 0);

        // Konvertiere zu Base64
        this.capturedImage = canvas.toDataURL('image/jpeg', 0.8);

        // Stoppe die Kamera
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Fehler beim Zugriff auf die Kamera:', error);
      alert('Kamera-Zugriff nicht möglich. Bitte überprüfen Sie die Berechtigungen.');
    }
  }

  async selectFromGallery() {
    try {
      // Erstelle ein verstecktes File-Input-Element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.capturedImage = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }
      });

      input.click();
    } catch (error) {
      console.error('Fehler beim Auswählen des Bildes:', error);
    }
  }

  removeImage() {
    this.capturedImage = undefined;
  }
}
