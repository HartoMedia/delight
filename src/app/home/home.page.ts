import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  IonToolbar
} from '@ionic/angular/standalone';
import {Delight, DelightService} from '../services/delight-service';
import {DelightDetailModalComponent} from '../components/delight-detail-modal/delight-detail-modal.component';
import {addIcons} from 'ionicons';
import {camera, cameraReverse, checkmark, close, image, refresh, trash} from 'ionicons/icons';

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
  @ViewChild('video', {static: false}) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', {static: false}) canvasElement!: ElementRef<HTMLCanvasElement>;

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
  currentFacingMode: 'environment' | 'user' = 'environment';
  hasMultipleCameras = false;

  // Für das Delight-Detail-Modal
  isDetailModalOpen = false;
  selectedDelight: Delight | null = null;

  constructor(
    private delightService: DelightService,
  ) {
    addIcons({camera, close, checkmark, refresh, trash, cameraReverse, image});
  }

  ngOnInit() {
    this.loadEmojiConfiguration();
    this.loadExistingDelights();
    this.checkCameraSupport();
  }

  async checkCameraSupport() {
    try {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        this.isCameraSupported = true;

        // Prüfe ob mehrere Kameras verfügbar sind
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        this.hasMultipleCameras = videoDevices.length > 1;
      } else {
        this.isCameraSupported = false;
      }
    } catch (error) {
      console.warn('Fehler beim Ermitteln der Kamera-Unterstützung:', error);
      this.isCameraSupported = false;
    }
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
          facingMode: this.currentFacingMode,
          width: {ideal: 1920},
          height: {ideal: 1080}
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

  async switchCamera() {
    if (!this.hasMultipleCameras) return;

    // Wechsle zwischen Front- und Rückkamera
    this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';

    // Schließe die aktuelle Kamera und öffne sie mit der neuen Einstellung
    this.closeCamera();

    // Kurz warten bevor die neue Kamera geöffnet wird
    setTimeout(() => {
      this.openCamera();
    }, 200);
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

    // Konvertiere zu Base64 mit besserer Qualität
    this.capturedImage = canvas.toDataURL('image/jpeg', 0.9);

    // Schließe die Kamera nach dem Aufnehmen
    this.closeCamera();
  }

  // Neue Upload-Funktionen
  triggerFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleImageUpload(file);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  handleImageUpload(file: File) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine gültige Bilddatei aus.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        // Erstelle Canvas zum Verkleinern des Bildes
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Berechne neue Dimensionen (max 1920x1080)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let {width, height} = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Zeichne das Bild auf die Canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Konvertiere zu Base64
        this.capturedImage = canvas.toDataURL('image/jpeg', 0.9);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.capturedImage = undefined;
  }

  retakePhoto() {
    this.capturedImage = undefined;
    this.openCamera();
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
