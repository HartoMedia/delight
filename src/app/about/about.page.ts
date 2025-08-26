import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonButton
  ]
})
export class AboutPage implements OnInit {

  version: string = '...';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadVersion();
  }

  loadVersion() {
    this.http.get<any>('/manifest.webmanifest').subscribe({
      next: (manifest) => {
        this.version = manifest.version || '0.0';
      },
      error: (error) => {
        console.error('Error loading manifest:', error);
        this.version = '0.0';
      }
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

}
