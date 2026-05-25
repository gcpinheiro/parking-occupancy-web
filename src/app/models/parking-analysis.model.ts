export type ParkingSpaceStatus = 'free' | 'occupied';

export interface ParkingSpaceAnalysis {
  id: number;
  status: ParkingSpaceStatus;
  score: number;
}

export interface ParkingAnalysisResponse {
  totalSpaces: number;
  freeSpaces: number;
  occupiedSpaces: number;
  spaces: ParkingSpaceAnalysis[];
  processedImageBase64: string;
}
