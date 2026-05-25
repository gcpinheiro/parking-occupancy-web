import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParkingAnalysisResponse } from '../models/parking-analysis.model';

@Injectable({
  providedIn: 'root',
})
export class ParkingAnalysisService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://parking-occupancy-api.onrender.com';

  analyzeImage(image: File): Observable<ParkingAnalysisResponse> {
    const formData = new FormData();
    formData.append('currentImage', image);

    return this.http.post<ParkingAnalysisResponse>(`${this.apiUrl}/parking/analyze`, formData);
  }
}
