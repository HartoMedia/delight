import {Component, Input, Output, EventEmitter} from '@angular/core';
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
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Delight} from '../../services/delight-service';
import {addIcons} from 'ionicons';
import {close, calendar, pricetag, image} from 'ionicons/icons';

@Component({
  selector: 'app-delight-detail-modal',
  templateUrl: './delight-detail-modal.component.html',
  styleUrls: ['./delight-detail-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonLabel
  ]
})
export class DelightDetailModalComponent {
  @Input() delight!: Delight;
  @Input() isOpen = false;
  @Output() didDismiss = new EventEmitter<void>();

  constructor() {
    addIcons({close, calendar, pricetag, image});
  }

  closeModal() {
    this.didDismiss.emit();
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

  formatTags(tags: string[]): string {
    return tags.length > 0 ? tags.join(', ') : 'Keine Tags';
  }
}
