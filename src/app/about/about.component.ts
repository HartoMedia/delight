import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {arrowBack} from 'ionicons/icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonIcon,
    IonButton
  ]
})
export class AboutComponent implements OnInit {

  version: string = '...';

  constructor(private http: HttpClient, private location: Location) {
    addIcons({arrowBack});
  }

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

  goBack() {
    this.location.back();
  }

}
