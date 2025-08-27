import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Delight {
  id: number;
  description?: string;
  emoji: string;
  imageBase64?: string; // Base64-kodiertes Bild für Local Storage
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum DelightCategory {
  FOOD = 'food',
  TRAVEL = 'travel',
  HOBBY = 'hobby',
  SOCIAL = 'social',
  LEARNING = 'learning',
  WELLNESS = 'wellness',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other'
}

@Injectable({
  providedIn: 'root'
})
export class DelightService {
  private delightsSubject = new BehaviorSubject<Delight[]>([]);
  public delights$ = this.delightsSubject.asObservable();

  private storageKey = 'delights';

  constructor() {
    this.loadDelights();
  }

  // CREATE - Neues Delight erstellen
  createDelight(delightData: Omit<Delight, 'id' | 'createdAt' | 'updatedAt'>): Delight {
    const newDelight: Delight = {
      ...delightData,
      id: this.generateNumericId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentDelights = this.delightsSubject.value;
    const updatedDelights = [...currentDelights, newDelight];

    this.updateDelights(updatedDelights);
    return newDelight;
  }

  // READ - Alle Delights abrufen
  getAllDelights(): Observable<Delight[]> {
    return this.delights$;
  }

  // READ - Delight nach ID abrufen
  getDelightById(id: number): Delight | undefined {
    return this.delightsSubject.value.find(delight => delight.id === id);
  }

  // READ - Delights nach Tags filtern
  getDelightsByTag(tag: string): Delight[] {
    return this.delightsSubject.value.filter(delight =>
      delight.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  // UPDATE - Delight aktualisieren
  updateDelight(id: number, updates: Partial<Omit<Delight, 'id' | 'createdAt'>>): boolean {
    const currentDelights = this.delightsSubject.value;
    const index = currentDelights.findIndex(delight => delight.id === id);

    if (index === -1) {
      return false;
    }

    const updatedDelight: Delight = {
      ...currentDelights[index],
      ...updates,
      updatedAt: new Date()
    };

    const updatedDelights = [...currentDelights];
    updatedDelights[index] = updatedDelight;

    this.updateDelights(updatedDelights);
    return true;
  }

  // DELETE - Delight löschen
  deleteDelight(id: number): boolean {
    const currentDelights = this.delightsSubject.value;
    const filteredDelights = currentDelights.filter(delight => delight.id !== id);

    if (filteredDelights.length === currentDelights.length) {
      return false; // Kein Delight mit dieser ID gefunden
    }

    this.updateDelights(filteredDelights);
    return true;
  }

  // DELETE - Alle Delights löschen
  deleteAllDelights(): void {
    this.updateDelights([]);
  }

  // UTILITY - Statistiken abrufen
  getStatistics() {
    const delights = this.delightsSubject.value;

    // Sammle alle Tags in einem flachen Array
    const allTags: string[] = [];
    delights.forEach((d: Delight) => {
      allTags.push(...d.tags);
    });

    return {
      total: delights.length,
      delightsWithImages: delights.filter((d: Delight) => d.imageBase64).length,
      totalTags: [...new Set(allTags)].length,
      mostUsedTags: this.getMostUsedTags()
    };
  }

  // IMAGE HANDLING - Bild von File zu Base64 konvertieren
  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
      reader.readAsDataURL(file);
    });
  }

  // IMAGE HANDLING - Bild von URL zu Base64 konvertieren
  async convertUrlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.drawImage(img, 0, 0);

        try {
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataURL);
        } catch (error) {
          reject(new Error('Fehler beim Konvertieren des Bildes'));
        }
      };

      img.onerror = () => reject(new Error('Fehler beim Laden des Bildes'));
      img.src = url;
    });
  }

  // IMAGE HANDLING - Bild komprimieren für bessere Performance
  async compressImage(base64: string, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Berechne neue Dimensionen
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataURL = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataURL);
        } catch (error) {
          reject(new Error('Fehler beim Komprimieren des Bildes'));
        }
      };

      img.onerror = () => reject(new Error('Fehler beim Laden des Base64-Bildes'));
      img.src = base64;
    });
  }

  // CREATE - Delight mit Bild-File erstellen
  async createDelightWithImageFile(
    delightData: Omit<Delight, 'id' | 'createdAt' | 'updatedAt' | 'imageBase64'>,
    imageFile?: File
  ): Promise<Delight> {
    let imageBase64: string | undefined;

    if (imageFile) {
      try {
        const base64 = await this.convertFileToBase64(imageFile);
        imageBase64 = await this.compressImage(base64);
      } catch (error) {
        console.error('Fehler beim Verarbeiten des Bildes:', error);
        // Fahre ohne Bild fort
      }
    }

    return this.createDelight({
      ...delightData,
      imageBase64
    });
  }

  // CREATE - Delight mit Bild-URL erstellen
  async createDelightWithImageUrl(
    delightData: Omit<Delight, 'id' | 'createdAt' | 'updatedAt' | 'imageBase64'>,
    imageUrl?: string
  ): Promise<Delight> {
    let imageBase64: string | undefined;

    if (imageUrl) {
      try {
        const base64 = await this.convertUrlToBase64(imageUrl);
        imageBase64 = await this.compressImage(base64);
      } catch (error) {
        console.error('Fehler beim Laden des Bildes von URL:', error);
        // Speichere nur die URL als Fallback
      }
    }

    return this.createDelight({
      ...delightData,
      imageBase64
    });
  }

  // UPDATE - Bild zu existierendem Delight hinzufügen
  async addImageToDelight(id: number, imageFile: File): Promise<boolean> {
    try {
      const base64 = await this.convertFileToBase64(imageFile);
      const compressedBase64 = await this.compressImage(base64);

      return this.updateDelight(id, { imageBase64: compressedBase64 });
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Bildes:', error);
      return false;
    }
  }


  // UTILITY - Speicherplatz-Statistiken
  getStorageStats() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const sizeInBytes = stored ? new Blob([stored]).size : 0;
      const sizeInKB = Math.round(sizeInBytes / 1024);
      const sizeInMB = Math.round(sizeInKB / 1024 * 100) / 100;

      const delights = this.delightsSubject.value;
      const delightsWithImages = delights.filter(d => d.imageBase64).length;

      return {
        totalSizeBytes: sizeInBytes,
        totalSizeKB: sizeInKB,
        totalSizeMB: sizeInMB,
        totalDelights: delights.length,
        delightsWithImages,
        averageImageSize: delightsWithImages > 0 ? Math.round(sizeInKB / delightsWithImages) : 0
      };
    } catch (error) {
      console.error('Fehler beim Berechnen der Speicher-Statistiken:', error);
      return null;
    }
  }

  // Private Hilfsmethoden
  private updateDelights(delights: Delight[]): void {
    this.delightsSubject.next(delights);
    this.saveDelights(delights);
  }

  private generateNumericId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  private loadDelights(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const delights = JSON.parse(stored).map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt)
        }));
        this.delightsSubject.next(delights);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Delights:', error);
    }
  }

  private saveDelights(delights: Delight[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(delights));
    } catch (error) {
      console.error('Fehler beim Speichern der Delights:', error);
    }
  }

  private getMostUsedTags() {
    const delights = this.delightsSubject.value;
    const tagCounts: Record<string, number> = {};

    delights.forEach(delight => {
      delight.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    return sortedTags.slice(0, 10);
  }
}
