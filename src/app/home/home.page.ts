import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import {Delight, DelightService} from '../services/delight-service';
import {DelightDetailModalComponent} from '../components/delight-detail-modal/delight-detail-modal.component';
import {addIcons} from 'ionicons';
import {camera, close, checkmark, refresh} from 'ionicons/icons';

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
    IonIcon,
    DelightDetailModalComponent
  ]
})
export class HomePage implements OnInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  emojis: string[] = ['😀', '😊', '🎉', '❤️', '🌟', '🚀', '🎨', '🌈'];
  isModalOpen = false;
  selectedEmoji = '';
  description = '';
  existingDelights: Delight[] = [];
  capturedImage: string | undefined = undefined;

  // Kamera-bezogene Eigenschaften
  isCameraOpen = false;
  cameraStream: MediaStream | null = null;
  isCameraSupported = false;

  // Für das Delight-Detail-Modal
  isDetailModalOpen = false;
  selectedDelight: Delight | null = null;

  constructor(
    private delightService: DelightService,
    private modalController: ModalController
  ) {
    addIcons({ camera, close, checkmark, refresh });
  }

  ngOnInit() {
    this.loadEmojiConfiguration();
    this.loadExistingDelights();
    this.checkCameraSupport();
  }

  checkCameraSupport() {
    this.isCameraSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
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
    this.capturedImage = undefined;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEmoji = '';
    this.description = '';
    this.capturedImage = undefined;
    this.closeCamera();
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
    this.loadExistingDelights();
  }

  // Kamera-Funktionen
  async openCamera() {
    if (!this.isCameraSupported) {
      console.error('Kamera wird nicht unterstützt');
      return;
    }

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Rückkamera bevorzugen
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      this.isCameraOpen = true;

      // Warte einen Moment, bis das View aktualisiert ist
      setTimeout(() => {
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.cameraStream;
          this.videoElement.nativeElement.play();
        }
      }, 100);
    } catch (error) {
      console.error('Fehler beim Öffnen der Kamera:', error);
      alert('Fehler beim Zugriff auf die Kamera. Bitte überprüfen Sie die Berechtigungen.');
    }
  }

  closeCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    this.isCameraOpen = false;
  }

  capturePhoto() {
    if (!this.videoElement || !this.canvasElement || !this.cameraStream) {
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    // Setze die Canvas-Größe auf die Video-Größe
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Zeichne das aktuelle Video-Frame auf die Canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Konvertiere zu Base64
    this.capturedImage = canvas.toDataURL('image/jpeg', 0.8);

    // Schließe die Kamera nach dem Foto
    this.closeCamera();
  }

  retakePhoto() {
    this.capturedImage = undefined;
    this.openCamera();
  }

  removePhoto() {
    this.capturedImage = undefined;
  }

  // Neue Methode für das Öffnen des Detail-Modals
  async openDelightDetail(delight: Delight) {
    this.selectedDelight = delight;
    this.isDetailModalOpen = true;
  }

  // Neue Methode für das Schließen des Detail-Modals
  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedDelight = null;
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
