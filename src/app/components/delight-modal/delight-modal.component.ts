import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalController} from '@ionic/angular/standalone';
import {DelightService} from '../../services/delight-service';

@Component({
  selector: 'app-delight-modal',
  templateUrl: './delight-modal.component.html',
  styleUrls: ['./delight-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class DelightModalComponent {
  @Input() selectedEmoji: string = '';

  description: string = '';

  constructor(
    private modalController: ModalController,
    private delightService: DelightService
  ) {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  saveDelight() {
    const delightData = {
      emoji: this.selectedEmoji,
      description: this.description || '',
      tags: [],
      imageBase64: undefined
    };

    this.delightService.createDelight(delightData);
    this.modalController.dismiss({saved: true});
  }
}
