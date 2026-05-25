import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { ParkingAnalysisResponse } from '../../models/parking-analysis.model';
import { ParkingAnalysisService } from '../../services/parking-analysis.service';

@Component({
  selector: 'app-parking-analysis',
  imports: [CommonModule],
  templateUrl: './parking-analysis.component.html',
  styleUrl: './parking-analysis.component.scss',
})
export class ParkingAnalysisComponent {
  private readonly parkingAnalysisService = inject(ParkingAnalysisService);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly result = signal<ParkingAnalysisResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly processedImageUrl = computed(() => {
    const analysis = this.result();
    if (!analysis) {
      return null;
    }

    return analysis.processedImageBase64.startsWith('data:image/')
      ? analysis.processedImageBase64
      : `data:image/jpeg;base64,${analysis.processedImageBase64}`;
  });

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.clearPreview();
    this.result.set(null);
    this.errorMessage.set(null);

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.selectedFile.set(null);
      this.errorMessage.set('Select a valid image file.');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
  }

  protected analyzeImage(): void {
    const file = this.selectedFile();

    if (!file) {
      this.errorMessage.set('Select an image before starting the analysis.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    this.parkingAnalysisService
      .analyzeImage(file)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => this.result.set(response),
        error: () => {
          this.errorMessage.set(
            'Could not process the image. Check if the backend is running at http://localhost:8000.',
          );
        },
      });
  }

  protected formatScore(score: number): string {
    return `${(score * 100).toFixed(2)}%`;
  }

  private clearPreview(): void {
    const currentPreviewUrl = this.previewUrl();
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }
    this.previewUrl.set(null);
  }
}
